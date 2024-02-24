const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const csv = require("csv-stringify");
const R = require("ramda");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
  const { id } = req.params;
  request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
    if (e) {
      console.error(e);
      res.send(500);
    } else {
      res.send(investments);
    }
  });
});

app.get("/admin/report", handleAdminReport);

async function handleAdminReport(req, res) {
  try {
    const investments = await getInvestments();
    const companies = await getCompanies();
    const csvData = await getCsvData(investments, companies);
    const output = await generateCsv(csvData);
    await exportCsv(output);
    res.setHeader("Content-Type", "text/csv");
    res.send(output);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

const fetchData = (url) =>
  new Promise((resolve, reject) => {
    request.get(url, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });


const getInvestments = () =>
  fetchData(`${config.investmentsServiceUrl}/investments`);

const getCompanies = () =>
  fetchData(`${config.financialCompaniesServiceUrl}/companies`);

const getCsvData = (investmentsServiceResponse, companiesResponse) => {
  try {
    const investments = JSON.parse(investmentsServiceResponse.body);
    const companies = JSON.parse(companiesResponse.body);

    const processInvestment = (investment) =>
      Promise.resolve(
        R.chain((holding) => ({
          User: investment.userId,
          "First Name": investment.firstName,
          "Last Name": investment.lastName,
          Date: investment.date,
          Holding: holding.name,
          Value:
            investment.investmentTotal *
              R.find((holding) => holding.id === holding.id, investment.holdings)
                .investmentPercentage,
        }))(companies)
      );

    return Promise.all(R.chain(processInvestment, investments));
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const generateCsv = (csvData) =>
  new Promise((resolve, reject) => {
    csv.stringify(csvData, (err, output) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(output);
      }
    });
  });

const exportCsv = (output) =>
  new Promise((resolve, reject) => {
    request.post(
      {
        url: `${config.investmentsServiceUrl}/export`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: output }),
      },
      (e) => {
        if (e) {
          console.error(e);
          reject(e);
        } else {
          resolve();
        }
      }
    );
  });

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});

module.exports = {
  handleAdminReport,
  getCompanies,
  getInvestments,
  getCsvData,
  generateCsv,
  exportCsv,
};

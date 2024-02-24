const index = require('./index');
const config = require('config');
const request = require('request');

describe('getCsvData', () => {
  test('should return the correct CSV data', () => {
    const investmentsServiceResponse = {
      body: JSON.stringify([
        {
          id: "1",
          userId: "1",
          firstName: "John",
          lastName: "Doe",
          investmentTotal: 2000,
          date: "2021-01-01",
          holdings: [{ id: "2", investmentPercentage: 1 }],
        },
      ]),
    };

    const companiesResponse = {
      body: JSON.stringify([
        {
          id: "2",
          name: "Tech Investments",
          address: "123 Tech Street",
          postcode: "SW1A 1AA",
          frn: "123456"
        },
      ]),
    };

    const expectedCsvData = [
      [
        {
          User: "1",
          'First Name': 'John',
          'Last Name': 'Doe',
          Date: '2021-01-01',
          Holding: 'Tech Investments',
          Value: 2000,
        },
      ]
    ];

    return index.getCsvData(investmentsServiceResponse, companiesResponse).then((csvData) => {
      expect(csvData).toEqual(expectedCsvData);
    });
  });

  test('should handle error when parsing investments JSON', () => {
    const investmentsServiceResponse = {
      body: 'invalid-json',
    };

    const companiesResponse = {
      body: JSON.stringify([
        {
          id: "2",
          name: "Tech Investments",
          address: "123 Tech Street",
          postcode: "SW1A 1AA",
          frn: "123456"
        },
      ]),
    };

    console.error = jest.fn();

    return index.getCsvData(investmentsServiceResponse, companiesResponse).catch((e) => {
      expect(console.error).toHaveBeenCalledWith(expect.any(SyntaxError));
      expect(e).toBeInstanceOf(SyntaxError);
    });
  });

  test('should handle error when parsing companies JSON', () => {
    const investmentsServiceResponse = {
      body: JSON.stringify([
        {
          id: "1",
          userId: "1",
          firstName: "John",
          lastName: "Doe",
          investmentTotal: 2000,
          date: "2021-01-01",
          holdings: [{ id: "2", investmentPercentage: 1 }],
        },
      ]),
    };

    const companiesResponse = {
      body: 'invalid-json',
    };

    console.error = jest.fn();

    return index.getCsvData(investmentsServiceResponse, companiesResponse).catch((e) => {
      expect(console.error).toHaveBeenCalledWith(expect.any(SyntaxError));
      expect(e).toBeInstanceOf(SyntaxError);
    });
  });

  test('should handle error when processing investments', () => {
    const investmentsServiceResponse = {
      body: JSON.stringify([
        {
          id: "1",
          userId: "1",
          firstName: "John",
          lastName: "Doe",
          investmentTotal: 2000,
          date: "2021-01-01",
          holdings: [{ id: "2", investmentPercentage: 1 }],
        },
      ]),
    };

    const companiesResponse = {
      body: JSON.stringify([]),
    };

    console.error = jest.fn();

    return index.getCsvData(investmentsServiceResponse, companiesResponse).catch((e) => {
      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
      expect(e).toBeInstanceOf(Error);
    });
  });
});
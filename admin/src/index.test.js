const index = require('./index');

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
  
  describe('getInvestments', () => {
    test('should get investments', async () => {
      const investments = await index.getInvestments();

      const received = JSON.parse(investments.body);

      const expected = [
        {
          "id": "1",
          "userId": "1",
          "firstName": "Billy",
          "lastName": "Bob",
          "investmentTotal": 1400,
          "date": "2020-01-01",
          "holdings": [
            {
              "id": "2",
              "investmentPercentage": 1
            }
          ]
        },
        {
          "id": "2",
          "userId": "2",
          "firstName": "Sheila",
          "lastName": "Aussie",
          "investmentTotal": 20000,
          "date": "2020-01-01",
          "holdings": [
            {
              "id": "1",
              "investmentPercentage": 0.5
            },
            {
              "id": "2",
              "investmentPercentage": 0.5
            }
          ]
        },
        {
          "id": "3",
          "userId": "1",
          "firstName": "Billy",
          "lastName": "Bob",
          "investmentTotal": 1300,
          "date": "2020-02-01",
          "holdings": [
            {
              "id": "2",
              "investmentPercentage": 1
            }
          ]
        },
        {
          "id": "4",
          "userId": "2",
          "firstName": "Sheila",
          "lastName": "Aussie",
          "investmentTotal": 22000,
          "date": "2020-02-01",
          "holdings": [
            {
              "id": "1",
              "investmentPercentage": 0.5
            },
            {
              "id": "2",
              "investmentPercentage": 0.5
            }
          ]
        },
        {
          "id": "5",
          "userId": "1",
          "firstName": "Billy",
          "lastName": "Bob",
          "investmentTotal": 12000,
          "date": "2020-03-01",
          "holdings": [
            {
              "id": "2",
              "investmentPercentage": 1
            }
          ]
        },
        {
          "id": "6",
          "userId": "2",
          "firstName": "Sheila",
          "lastName": "Aussie",
          "investmentTotal": 21500,
          "date": "2020-03-01",
          "holdings": [
            {
              "id": "1",
              "investmentPercentage": 0.5
            },
            {
              "id": "2",
              "investmentPercentage": 0.3
            },
            {
              "id": "3",
              "investmentPercentage": 0.2
            }
          ]
        },
        {
          "id": "7",
          "userId": "3",
          "firstName": "John",
          "lastName": "Smith",
          "investmentTotal": 150000,
          "date": "2020-03-01",
          "holdings": [
            {
              "id": "1",
              "investmentPercentage": 0.8
            },
            {
              "id": "3",
              "investmentPercentage": 0.2
            }
          ]
        }
      ];

      expect(received).toEqual(expected);
    });
    
  });

  describe('getCompanies', () => {
    test('should get companies', async () => {
      const companies = await index.getCompanies();

      const received = JSON.parse(companies.body);

      const expected = [
        {
          "id": "1",
          "name": "The Big Investment Company",
          "address": "14 Square Place",
          "postcode": "SW18UU",
          "frn": "234165"
        },
        {
          "id": "2",
          "name": "The Small Investment Company",
          "address": "12 Circle Square",
          "postcode": "SW18UD",
          "frn": "773388"
        },
        {
          "id": "3",
          "name": "Capital Investments",
          "address": "1 Capital Road",
          "postcode": "SW18UT",
          "frn": "078592"
        }
      ];
  
      expect(received).toEqual(expected);
    });
  });
  
  describe('generateCsv', () => {
    test('should generate CSV', async () => {
      const csvData = [
        ['User', 'First Name', 'Last Name', 'Date', 'Holding', 'Value'],
        ['1', 'John', 'Doe', '2021-01-01', 'Tech Investments', 2000],
      ];
  
      const csvString = await index.generateCsv(csvData);
  
      expect(csvString).toEqual(expect.any(String));
    });
  });
  
  describe('exportCsv', () => {
    test('should export CSV', async () => {
      const output = 'CSV data';
  
      const result = await index.exportCsv(output);
  
      expect(result).toBeUndefined();
    });
  });
});
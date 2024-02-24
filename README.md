# Investment Holdings CSV Report Generator

This codebase serves as an implementation of an admin service in an investment management system. As an admin, the system enables you to generate a CSV report, detailing values of all user investment holdings.

## Background

The application achieves this functionality by interfacing with endpoints provided by both the Investments and Financial Companies services.

- **Investments Service:** This service provides important information about each individual user investment and the overall investment data. It includes data points such as the total amount of a user's investment and various investment percentages in different holding accounts.

- **Financial Companies Service:** This service facilitates access to data about different financial companies. Details include the name of the holding accounts where a user could place their investments.

Upon fetching data from these two services, the admin service processes it to generate a comprehensive investment report. The generated report contains details of each holding under the following headers: `User`, `First Name`, `Last Name`, `Date`, `Holding`, and `Value`.

Once generated, the report is forwarded to the `/export` endpoint of the Investments service in the `Content-Type` of `application/json`, ensuring seamless integration and data exchange between different microservices in the system.

## New Route

A new GET route has been added as `/admin/report`. This route triggers the generation of the financial CSV report.

## How might you make this service more secure?

There are several steps that I would take in order to enhance service security:

- **Secret Management:** I would move sensitive data like service URLs out of the codebase and into secure environment variables.
- **Implement Content Security Policy (CSP):** To safeguard against Cross-Site Scripting (XSS) attacks, I'd employ a Content Security Policy.
- **Rate Limit Requests:** To bolster resilience against brute-force or DoS attacks, I'd limit the number of requests a client can make within a given timeframe.
- **Leverage Security Headers:** I'd enhance application security by adopting HTTP headers like HTTP Strict Transport Security and X-Frame-Options.
- **Use JWT Tokens:** JWT Tokens could be used for Authentication and Authorisation to allow for secure information exchange.

## How would you make this solution scale to millions of records?

To scale this solution to support millions of records:

- **Optimise Data Fetching:** I'd avoid fetching large amounts of data from investment and company services all in one go. Fetching large data sets could exhaust database or network resources. To handle data fetching in manageable chunks, I'd consider implementing pagination or using streaming.
- **Enhance Data Processing:** CPU-intensive tasks like CSV generation could potentially become a bottleneck when working with a large number of records. To mitigate this, I'd employ stream-based processing which would enable processing of records as they are received, rather than all at once.
- **Implement Caching:** If the same reports are generated regularly, then caching the results and employing an appropriate cache invalidation strategy could vastly improve performance by avoiding the redundant computation of the same result.
- **Employ Load Balancing:** If the server is under significant strain during periods of high demand, I'd consider employing load balancing to evenly distribute incoming network traffic across several servers.
- **Make Asynchronous Requests:** If several different requests are being made and responses are being combined (for example, fetching data for each holding individually), then I'd consider making these requests asynchronously, allowing them to run in parallel and optimize data fetching.
- **Optimise Database:** Indexing could expedite data retrieval when dealing with a large database. Regular maintenance tasks, such as purging unnecessary data, could also enhance database operations.
- **Establish Scalable Infrastructure:** If the service is housed in a container (such as Docker), it could be easily scaled up by increasing the number of containers during periods of high demand and reducing the number of containers when demand recedes.

## What else would you have liked to improve given more time?

Given more time, several other improvements could be made:

- **Code Refactoring:** I would refactor parts of the codebase for better organization, readability, and maintainability - for instance, moving the CSV logic, currently embedded in `index.js`, into a separate, dedicated module.
- **Performance Optimization:** With potentially large amounts of data and network latency, I'd explore adding caching layers for frequently fetched data and utilizing batch operations or stream-based processing for handling sizable CSV data.
- **Enhanced Error Handling and Logging:** Error identification could be made more accurate by implementing a more robust error-handling mechanism, potentially involving the creation of custom error classes. Additionally, enhancing the logging system for better traceability and activity records, and deploying varying logging levels as needed, could be beneficial.
- **Containerisation:** The process of deployment, distribution, and scaling could be simplified by containerising the service using Docker.
- **API Documentation:** Comprehensive documentation for our API endpoints could be produced to aid other developers in understanding how to interact with our service efficiently.
- **Monitoring and Metrics:** I'd consider incorporating metrics to track elements, such as request duration and request count over specific periods, to help identify issues early on and provide valuable insights about the service.
- **Testing Enhancements:** I'd aim to increase test coverage to over 90%, for more comprehensive coverage. As part of this effort, I'd consider diversifying my test types - perhaps, including integration or end-to-end tests - and taking into account edge cases and failure scenarios in my testing approach.
- **Continuous Integration and Continuous Deployment (CI/CD):** I'd focus on establishing a CI/CD pipeline for automated testing and deployment. This would ensure that the codebase remains in a continuously releasable state, thus streamlining the delivery process.

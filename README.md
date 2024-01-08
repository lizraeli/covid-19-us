[![Netlify Status](https://api.netlify.com/api/v1/badges/99cd1cf5-d260-49a6-803f-a0ec93f7973e/deploy-status)](https://app.netlify.com/sites/covid19-us/deploys)

[![Coverage Status](https://coveralls.io/repos/github/lizraeli/covid-19-us/badge.svg?branch=dev)](https://coveralls.io/github/lizraeli/covid-19-us?branch=dev)

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Covid-19 Data in the US](#covid-19-data-in-the-us)
- [Libraries](#libraries)
- [The Data](#the-data)
  - [Narrowing by state and county](#narrowing-by-state-and-county)
  - [Viewing Modes](#viewing-modes)
- [Available Scripts](#available-scripts)
  - [`yarn start`](#yarn-start)
  - [`yarn test`](#yarn-test)
  - [`yarn test:coverage`](#yarn-testcoverage)
  - [`yarn build`](#yarn-build)

## Covid-19 Data in the US

This project allows viewing cases of Covid-19 in the US, in a US state, or in a county within a state. This project uses the [NY Times Covid-19 Data](https://github.com/nytimes/covid-19-data). The data is hosted in the following CSV files:

- [U.S. Data](https://github.com/nytimes/covid-19-data/blob/master/us.csv)
- [U.S. State-Level Data](https://github.com/nytimes/covid-19-data/blob/master/us-states.csv)
- [U.S. County-Level Data](https://github.com/nytimes/covid-19-data/blob/master/us-counties.csv)

**Note:** As of March 24, 2013, the NY Times no longer collects data on Covid-19.

## Libraries

This project is written using [typescript](https://www.typescriptlang.org/) and [Create React App](https://github.com/facebook/create-react-app) along with the following libraries:

- [Papaparse](https://www.papaparse.com/) - for parsing CSV files in the browser.
- [Apex Charts](https://apexcharts.com/) and [React-ApexChart](https://apexcharts.com/docs/react-charts/) - for displaying data charts.
- [React Select](https://react-select.com/) - for rendering nicely styled select components.
- [react-loader-spinner](https://www.npmjs.com/package/react-loader-spinner) - for the SVG spinner component.
- [Moment.js](https://momentjs.com/) - for parsing dates and filtering data by start date.
- [Lodash](https://lodash.com/) - for mapping and rearranging the parsed CSV data.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [React Hooks Testing Library](https://react-hooks-testing-library.com/) for testing.

## The Data

The shape of the NY-Times data as follows:

- [U.S. National-Level Data](https://github.com/nytimes/covid-19-data/blob/master/us.csv):

```ts
date: string;
cases: number;
deaths: number;
```

- [U.S. State-Level Data](https://github.com/nytimes/covid-19-data/blob/master/us-states.csv):

```ts
date: string;
state: string;
cases: number;
deaths: number;
```

- U.S. County-Level Data:

```ts
date: string;
state: string;
county: string;
cases: number;
deaths: number;
```

### Narrowing by state and county

Once the state-level data has been parsed, it is grouped by state:

```ts
{
    state1: data[],
    state2: data,
    ...
}
```

Once the county-level data has been parsed, it is grouped by county and by state in a tree-like structure:

```ts
{
    state1: {
        county1: data[],
        county2: data[]
    },
    state2: {
        county3: data[],
        county4: data[]
    },
    ...
}
```

- When no state is selected, the data for the entire US is displayed.

- When a state is selected in the state dropdown:

  - The data for that state is displayed.
  - The state is looked-up in the state-county dictionary. If it is found, all counties grouped under that state are displayed in the county dropdown.

- When a county is selected in the county dropdown, the data for that county is displayed.

### Viewing Modes

The view dropdown allows to view case data in 4 modes:

- Total Cases - this is the default view
- New Cases - calculated for each day based on `[cases on day] - [case on previous day]`
- Total Deaths
- New Deaths - calculated using the same method as New Cases

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:coverage`

Launches the test runner and generates test coverage in the terminal.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

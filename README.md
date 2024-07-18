<div align="center">
  <a href="https://github.com/frontandrews/booking-management-app/issues/new?assignees=&labels=bug&projects=&template=01_BUG_REPORT.md&title=bug%3A+">Report a Bug</a>
  ·
  <a href="https://github.com/frontandrews/booking-management-app/issues/new?assignees=&labels=enhancement&projects=&template=02_FEATURE_REQUEST.md&title=feat%3A+">Request a Feature</a>
  ·
  <a href="mailto:andrews.ribeiro.gomes@gmail.com">Send Email Notification</a>
</div>

<div align="center">
  <br />
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/dec0dOS/amazing-github-template.svg?style=flat-square" alt="license"/>
  </a>
  <a href="https://github.com/frontandrews/booking-management-app/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22">
    <img src="https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square" alt="PRs welcome"/>
  </a>
</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [How to Start](#how-to-start)
- [License](#license)
- [Acknowledgements](#acknowledgements)

</details>

---

## About

<table>
<tr>
<td>

This application is designed to manage properties and reservations. Users can register properties, schedule reservations, and add prices that can be charged per day. The app features a dashboard where users can see monthly revenue and compare it with previous months.

</td>
</tr>
</table>

### Built With

- React
- NextJS
- Redux
- Typescript
- Jest
- JSON Server / JSON Server Auth
- react-hook-form
- Zod
- Radix-ui
- Eslint

## Getting Started

### Prerequisites

- Node > 18
- Yarn (preferable)

### How to Start

```sh
yarn install
yarn dev
```

Open a new terminal and run the backend mocking API:

```sh
yarn server:run
```

After running, open the app on the home page where a guide explains how to use the features.

**Basic Features**

- Home page with demos of how to use the app.
- Create Account and Sign In integrated with json-server-auth.
- Dashboard Page
  - Users can create, read, update, and delete:
    - Properties
    - Booking Reservations
  - Booking stats

### Possible Improvements

- Use context API for changing themes.
- Re-work pricing as it may vary based on the day/month.
- Implement block periods.
- Allow multi-account access with different properties.
- Refactor the app router to:
  - Use Redux for globally shared, mutable data only.
  - Use Next.js state (search params, route parameters, form state, etc.), React context, and React hooks for other state management.
- Define guest limits per property and ensure they are not exceeded when creating/updating bookings.
- Create a backend app.

### Design Choices

- **State Management:** Using Redux for application state.
- **Routing:** Next.js navigation.
- **API/Data Fetching:**
  - Auth data managed through Redux and saved in localStorage.
  - API calls handled by json-server with json-server-auth to simulate a REST API.
- **Styling:**
  - Using Tailwind CSS.
  - Radix UI for foundational components.
- **Performance:**
  - Using 'use client' for components that require client-side features.
  - Removing 'use client' where possible for faster rendering with SSR.
- **Error Handling:** Using Zod schema validation to prevent submission of invalid data.
- **Testing:** Using Jest to ensure the app functions as expected.
- **Code Quality:** Eslint for code quality.
- **User Experience:** Responsive design for smaller devices, with a different calendar view for mobile to ensure responsiveness.

## License

This project is licensed under the **MIT license**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.

## Acknowledgements

Thanks to these awesome resources used during development:

- <https://redux.js.org/usage/writing-tests>
- <https://stackoverflow.com/questions/66758855/react-hook-form-validation-not-working-when-using-onblur-mode>
- <https://github.com/typicode/json-server>

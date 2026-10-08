# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-08

User stories: code-corhuila/barber-saas-docs#4, code-corhuila/barber-saas-docs#59, code-corhuila/barber-saas-docs#68, code-corhuila/barber-saas-docs#76

### Added

- **federation:** build the remote with native federation exposing ./mount
- **app:** copy the types of the contract with the shell
- **federation:** mount the app in the element the shell provides
- **schedule:** add the types of schedule-service.yaml
- **schedule:** call schedule-api and barbershop-api only through the shell client
- **schedule:** edit a week with several blocks per day and check them before saving
- **schedule:** check the exception form with the limits of the contract
- **navigation:** add the routes of the domain and find the barber's own profile
- **ui:** show loading, error with retry, empty and data in every view
- **ui:** let the owner pick a barber of the barbershop
- **ui:** edit a barber's week with split shifts and save it whole
- **navigation:** route the owner to any barber and a barber to their own week
- **ui:** register a day off or special hours with one idempotency key per intent
- **ui:** list the coming days off and special hours and delete them
- **navigation:** open the exceptions of a barber for the owner and the barber
- **deploy:** serve the built remote for development and review
- **schedule:** read the barber's name with a spanish fallback
- **ui:** show the barber's name in the schedule list
- **app:** copy the shell's enterBarbershop and barbershopId into the contract

### Fixed

- **ui:** write the schedule hours on a 24-hour clock
- **ui:** keep the save bar of the week flush with the bottom
- **ui:** explain the date and the day off in the special day form
- **ui:** keep the save bar above the cards' time inputs

### Documentation

- **readme:** explain the schedule app, how to run it with the shell and how to test it
- **readme:** point the header to Barber Saas and barber-saas-docs

### Tests

- **ci:** run the tests, check the types and build the remote on every pull request
- **schedule:** specify the api calls, the week editor, the exception form and the routes
- **ui:** specify the error message shown and the idempotency keys
- **schedule:** specify the barber name and its fallback
- **schedule:** specify typing a time on a 24-hour clock

### Maintenance

- **app:** ignore dependencies, build output and env files
- **github:** add the pull request template
- **github:** track the story environment on the board
- **build:** add ionic react 8, react 19 and typescript with the shell's versions
- **ui:** keep the dark and gold look of the prototype under its own prefix
- use the new repository name barber-saas-infra-postgres

[2.0.0]: https://github.com/code-corhuila/barber-saas-schedule-app/releases/tag/v2.0.0

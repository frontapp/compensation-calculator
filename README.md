# Compensation package calculator

## Purpose

This tool is designed for late-stage candidates whom you sent an offer to.

It is designed to both give them an overview of what they should expect given their current offer as well as being transparent about your company's status.

## Installation

`npm install`

## Configuration

There are 5 setings you can setup in your `.env` file: USERNAME and PASSWORD for basic authentication, COMPANY\_NAME and finally informations found in the most recent 409A valuation:

```
USERNAME=username
PASSWORD=password
COMPANY\_NAME=company
STRIKE\_PRICE=0.01
NB\_FULLY\_DILUTED\_SHARES=123456789
```

You can pre-populate the yearly salary and number of options fields by passing arguments to the URL to share package specifications directly:

`/?salary=54321&options=12345`

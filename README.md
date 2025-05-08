[![Minzipped size](https://badgen.net/bundlephobia/minzip/react-time-formatter?color=green)](https://bundlephobia.com/package/react-time-formatter) [![Dependencies](https://badgen.net/bundlephobia/dependency-count/react-time-formatter?color=green)](https://bundlephobia.com/package/react-time-formatter) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/react-time-formatter?color=green)](https://bundlephobia.com/package/react-time-formatter) [![npm version](https://img.shields.io/npm/v/react-time-formatter?color=informational)](https://www.npmjs.com/package/react-time-formatter)

React-first date & time formatting library with a clear API and built-in timezone support

## Features

- 📅 `DateTime` — A consistent wrapper around `Date` with zoned time support
- ⏱️ `Duration` — A fixed time span that overflows into larger units automatically
- 🗓️ `Interval` — Calendar-aware difference between two dates
- 🌍 `tz` — Timezone engine with sensible built-in zones and override support
- 📦 Fully tree-shakable with both ESM and CJS builds
- 💙 TypeScript-native with full static type safety
- 🚫 Zero-dependency
## Example

Just write what you mean—the API stays out of your way.

```tsx
<Duration of={{ minutes: 80 }}>
  {t => <span> {t.HH} hours {t.mm} minutes </span>}
</Duration>

{/* 1 hour 20 minutes */}
```

Automatically falls back to smaller units when larger ones aren’t requested:

```tsx
<Interval from='1789-07-14' to='1799-11-09'>
  {t => <span> {t.YY} years {t.MM} months {t.DD} days </span>}
</Interval>

{/* 10 years 03 months 26 days */}


<Interval from='1789-07-14' to='1799-11-09'>
  {t => <span> {t.DD} days </span>}
</Interval>

{/* 3770 days */}
```

Consistent and non-misleading: shows placeholders instead of correct-looking false values.

```tsx
<DateTime at={new Date(1e15)}>
	{dt => <span> {dt.hh}:{dt.mm} {dt.A} {dt.MM}/{dt.DD} {dt.YYYY} </span>}
</DateTime>

{/* ##:## -- ##/## #### */}
```

## Setup

Installation
```bash
npm install react-time-formatter
```

ESM import
```typescript
import { DateTime, Interval, Duration } from 'react-time-formatter'
```

CJS import
```typescript
const { DateTime } = require('react-time-formatter/DateTime');
const { Interval } = require('react-time-formatter/Interval');
const { Duration } = require('react-time-formatter/Duration');
```
## API Reference
### DateTime
`DateTime` is a specific point on the timeline.
#### Props
- `at:` `number` | `string` | `Date` | [`CalendarDate`](#CalendarDate) — The date to be displayed.
- `timezone?:` `'UTC'` | `'Local'` | `number` | [`Timezone`](#Timezone) — The timezone in which the date will be displayed.
- `children?:` [`Render`](#Render) — Render function
- `render?:` [`Render`](#Render) — Render function (alias for `children`)
#### Output
Passed to render function and abbreviated as `dt` in this doc.

```tsx
<DateTime at={new Date('2025-02-05T15:08:09.998+10:00')}>
  {dt => <span> {dt.hh}:{dt.mm} {dt.A} {dt.MM}/{dt.DD} {dt.YYYY} </span>}
</DateTime>
```
##### Pre-formatted keys
Always `string`:

|Token|Description|Example|
|---|---|---|
|`dt.YY`|2-digit year|`25`|
|`dt.YYYY`|4-digit year|`2025`|
|`dt.M`|Month (1–12)|`2` (February)|
|`dt.MM`|2-digit month|`02`|
|`dt.D`|Day of the month (1–31)|`5`|
|`dt.DD`|2-digit day of the month|`05`|
|`dt.d`|Day of week (1 = Monday)|`1`|
|`dt.H`|Hour (24h)|`15`|
|`dt.HH`|2-digit hour (24h)|`15`|
|`dt.h`|Hour (12h)|`3`|
|`dt.hh`|2-digit hour (12h)|`03`|
|`dt.m`|Minute|`8`|
|`dt.mm`|2-digit minute|`08`|
|`dt.s`|Second|`9`|
|`dt.ss`|2-digit second|`09`|
|`dt.SSS`|Milliseconds (3-digit)|`998`|
|`dt.A`|Meridiem (uppercase)|`AM` / `PM`|
|`dt.a`|Meridiem (lowercase)|`am` / `pm`|
|`dt.Z`|UTC offset (`+hh:mm` or `Z`)|`+10:00`|
|`dt.ZZ`|UTC offset (`+hhmm`)|`+1000`|
##### Raw keys
Always `number`:
- **Calendar tokens:**
	- `dt.year`
	- `dt.month` (1-indexed)
	- `dt.date`
	- `dt.day`
	- `dt.hours`
	- `dt.minutes`
	- `dt.seconds`
	- `dt.milliseconds`
- **Timezone offset:**
	- `dt.timezoneOffset` timezone offset in minutes, `-180` means `UTC+3`, useful for debugging
### Duration
`Duration` is a **fixed quantity of time units, independent of specific dates** or positions on a timeline.
#### Props
- `of:` `number` [`RelativeTime`](#RelativeTime) — The quantity of time in milliseconds or arbitrary units
- `children?:` [`Render`](#Render) — Render function
- `render?:` [`Render`](#Render) — Render function (alias for `children`)
#### Output
Passed to render function and abbreviated as `t` in this doc.

```tsx
<Duration of={4800000}>
  {t => <span> {t.HH} hours {t.mm} minutes </span>}
</Duration>
```
##### Pre-formatted keys
Always `string`, numbers inside string are **never** negative:

|Token|Description|Example|
|---|---|---|
|`t.Y`|Years (1–2 digits)|`5`|
|`t.YY`|2-digit years|`05`|
|`t.M`|Months (1–2 digits)|`2`|
|`t.MM`|2-digit months|`02`|
|`t.W`|Weeks (1–2 digits)|`2`|
|`t.WW`|2-digit weeks|`02`|
|`t.D`|Days (1–2 digits)|`4`|
|`t.DD`|2-digit days|`04`|
|`t.H`|Hours (1–2 digits)|`15`|
|`t.HH`|2-digit hours|`15`|
|`t.m`|Minutes (1–2 digits)|`8`|
|`t.mm`|2-digit minutes|`08`|
|`t.s`|Seconds (1–2 digits)|`9`|
|`t.ss`|2-digit seconds|`09`|
|`t.SSS`|Milliseconds (3 digits)|`998`|
##### Unit values
Always `number`. Always **positive.**
- **Breakdown by unit:**
	- `t.years`
	- `t.months`
	- `t.weeks`
	- `t.days`
	- `t.hours`
	- `t.minutes`
	- `t.seconds`
	- `t.milliseconds`
##### Total values
Always `number`. Either **all positive** or **all negative.**
- **Full duration converted to single unit:**
	- `t.totalYears`
	- `t.totalMonths`
	- `t.totalWeeks`
	- `t.totalDays`
	- `t.totalHours`
	- `t.totalMinutes`
	- `t.totalSeconds`
	- `t.totalMilliseconds`

> ❗ For Duration **`years` are approximated to 365 days** and **`months` are approximated to `30 days`.**  Use [Interval](###Interval) if these units need to be precisely reflected.
### Interval
`Interval` is a **calendar-aware span between two dates.** Unlike [Duration](###Duration) Interval **accounts for** the variable length of `months` and `years`.
#### Props
- `from:` `number` | `string` | `Date` | [`CalendarDate`](#CalendarDate) — Starting point in time
- `to:` `number` | `string` | `Date` | [`CalendarDate`](#CalendarDate) — Ending point in time (non-inclusive)
- `timezone?:` `'UTC'` | `'Local'` | `number` | [`Timezone`](#Timezone) — The timezone in which the difference will be calculated
- `children?:` [`Render`](#Render) — Render function
- `render?:` [`Render`](#Render) — Render function (alias for `children`)
#### Output
Passed to render function and abbreviated as `t` in this doc.
```tsx
<Interval from={new Date('1789-07-14')} to={new Date('1799-11-09')}>
  {t => <span> {t.YY} years {t.MM} months {t.DD} days </span>}
</Interval>
```
##### Pre-formatted keys
Always `string`, numbers inside string are **never** negative:

|Token|Description|Example|
|---|---|---|
|`t.Y`|Years (1–2 digits)|`5`|
|`t.YY`|2-digit years|`05`|
|`t.M`|Months (1–2 digits)|`2`|
|`t.MM`|2-digit months|`02`|
|`t.W`|Weeks (1–2 digits)|`2`|
|`t.WW`|2-digit weeks|`02`|
|`t.D`|Days (1–2 digits)|`4`|
|`t.DD`|2-digit days|`04`|
|`t.H`|Hours (1–2 digits)|`15`|
|`t.HH`|2-digit hours|`15`|
|`t.m`|Minutes (1–2 digits)|`8`|
|`t.mm`|2-digit minutes|`08`|
|`t.s`|Seconds (1–2 digits)|`9`|
|`t.ss`|2-digit seconds|`09`|
|`t.SSS`|Milliseconds (3 digits)|`998`|
##### Unit values
Always `number`. Always **positive.**
- **Breakdown by unit:**
	- `t.years`
	- `t.months`
	- `t.weeks`
	- `t.days`
	- `t.hours`
	- `t.minutes`
	- `t.seconds`
	- `t.milliseconds`
##### Total values
Always `number`. Either **all positive** or **all negative.**
- **Full duration converted to single unit:**
	- `t.totalYears`
	- `t.totalMonths`
	- `t.totalWeeks`
	- `t.totalDays`
	- `t.totalHours`
	- `t.totalMinutes`
	- `t.totalSeconds`
	- `t.totalMilliseconds`
## Timezone
Timezones can be applied to `DateTime` or `Interval` components.
### Native
Native timezones (except for `UTC`, `GMT` and `Local`) rely on browser's or Node's built-in **Intl** object.

The easiest way to apply timezone is just by importing it from its respective `tz/` path:
```tsx
import { DateTime } from 'react-time-formatter';
import Belgrade from 'react-time-formatter/tz/Europe/Belgrade'

{/* ... */}

<DateTime at={Date.now()} timezone={Belgrade}>
  {dt => <span> It's {dt.HH}:{dt.mm} in Belgrade! </span>}
</DateTime>
```

Alternatively, timezone can be applied by being defined manually:
```tsx
import { DateTime } from 'react-time-formatter';
import { createTimezone } from 'react-time-formatter/tz/createTimezone'

const Tokyo = createTimezone('Asia/Tokyo');

{/* ... */}

<DateTime at={Date.now()} timezone={Tokyo}>
  {dt => <span> It's {dt.HH}:{dt.mm} in Tokyo! </span>}
</DateTime>
```

Invalid timezones will never produce a valid-looking result:
```tsx
import { DateTime } from 'react-time-formatter';
import { createTimezone } from 'react-time-formatter/tz/createTimezone'

const What = createTimezone('Invalid/Unknown');

{/* ... */}

<DateTime at={Date.now()} timezone={What}>
  {dt => <span> It's always {dt.HH}:{dt.mm} in invalid timezone! </span>}
</DateTime>

{/* It's always ##:## in invalid timezone! */}
```

### Custom Timezone
Custom timezones are defined by a **TimezoneOffsetResolver** function that takes a date and returns a timezone offset in minutes and can be as simple as this:
```tsx
const UTC3 = () => -180; // just a static offset

{/* ... */}

<DateTime at={Date.now()} timezone={UTC3}>
  {dt => <span> UTC{t.ZZ} time is {dt.HH}:{dt.mm} </span>}
</DateTime>

{/* equal to */}

<DateTime at={Date.now()} timezone={-180}>
  {dt => <span> UTC{t.ZZ} time is {dt.HH}:{dt.mm} </span>}
</DateTime>
```

The custom implementation of the Berlin timezone with its DST rules:
```tsx
// The manual equivalent of createTimezone('Europe/Berlin') call:

const Berlin: (date: Date) => number = date => {
  const year = date.getUTCFullYear();

  // Find last Sunday in March
  const startDST = new Date(Date.UTC(year, 2, 31, 1)); // March 31, 01:00 UTC
  while (startDST.getUTCDay() !== 0) {
    startDST.setUTCDate(startDST.getUTCDate() - 1);
  }

  // Find last Sunday in October
  const endDST = new Date(Date.UTC(year, 9, 31, 1)); // October 31, 01:00 UTC
  while (endDST.getUTCDay() !== 0) {
    endDST.setUTCDate(endDST.getUTCDate() - 1);
  }

  // If date is within DST range, return UTC+2 = -120
  if (date >= startDST && date < endDST) {
    return -120;
  }

  // Otherwise, return UTC+1 = -60
  return -60;
};

{/* ... */}

<DateTime at={Date.now()} timezone={Berlin}>
  {dt => <span> It's {dt.HH}:{dt.mm} in Berlin! </span>}
</DateTime>
```

## Type reference
### CalendarDate
A flat object representation for date. Must include at least year value. **`dt`** is guaranteed to be valid **CalendarDate**.
```ts
// year and month, all the rest values will be set to 0
const valid = {
  year: 2025,
  // 1-indexed, february
  month: 2,
  date: 15,
};

// meaningless without year
const invalid1 = {
  month: 2,
  date: 15
};

// should have at least year value
const invalid2 = {};

const full = {
  year: 2025,
  month: 2,
  date: 15,
  hours: 10,
  minutes: 0,
  seconds: 15,
  milliseconds: 12,

  // UTC+3. Since CalendarDate is just a snapshot, the timezone offset can only be a number.
  // Doesn't affect how the date will be displayed, only how it will be parsed.
  timezoneOffset: -180,
}
```
### RelativeTime
A flat representation of quantity of time. Must include at least one time unit to be valid. **`t`** is guaranteed to be valid **RelativeTime**.
```ts
// can't be empty object
const invalid = {}

// can have any units in any quantities
const valid = { minutes: 80 }

// with all units
const full = {
  years: 9,
  months: 10,
  weeks: 3,
  days: 4,
  hours: 5,
  minutes: 7,
  seconds: 15,
  milliseconds: 900
}
```
# License

MIT © 2025 Nikolai Laevskii

React-first date & time formatting library with a clear API and built-in timezone support

[![Minzipped size](https://badgen.net/bundlephobia/minzip/react-time-formatter?color=green)](https://bundlephobia.com/package/react-time-formatter) [![Dependencies](https://badgen.net/bundlephobia/dependency-count/react-time-formatter?color=green)](https://bundlephobia.com/package/react-time-formatter) [![Tree-shakable](https://badgen.net/bundlephobia/tree-shaking/react-time-formatter?color=green)](https://bundlephobia.com/package/react-time-formatter) [![npm version](https://img.shields.io/npm/v/react-time-formatter?color=informational)](https://www.npmjs.com/package/react-time-formatter)

## Features

- 📅 `DateTime` — A consistent wrapper around `Date` with zoned time support
- ⏱️ `Duration` — A fixed time span that overflows into larger units automatically
- 🗓️ `Interval` — Calendar-aware difference between two dates
- 🌍 `tz` — Timezone engine with sensible built-in zones and override support
- 📦 Fully tree-shakable with both ESM and CJS builds
- 💙 TypeScript-native with full static type safety
- 🚫 Zero-dependency
## Example

##### Just write what you mean—the API stays out of your way.

```tsx
<Duration of={{ minutes: 80 }}>
  {t => <span>{t.HH} hours {t.mm} minutes</span>}
</Duration>
```
 _→ 1 hours 20 minutes_
##### Automatically falls back to smaller units when larger ones aren’t requested:

```tsx
<Interval from='1789-07-14' to='1799-11-09'>
  {t => <span>{t.YY} years {t.MM} months {t.DD} days</span>}
</Interval>
```
 _→ 10 years 03 months 26 days_

```tsx
<Interval from='1789-07-14' to='1799-11-09'>
  {t => <span>{t.DD} days</span>}
</Interval>
```
 _→ 3770 days_
##### Consistent and non-misleading: shows placeholders instead of correct-looking false values.

```tsx
<DateTime at={new Date(1e15)}>
  {dt => <span>{dt.hh}:{dt.mm} {dt.A} {dt.MM}/{dt.DD} {dt.YYYY}</span>}
</DateTime>
```
 _→ ##:## -- ##/## ####_
## Setup

Installation
```bash
npm install react-time-formatter
```

ESM import
```typescript
import { Interval } from 'react-time-formatter'
```

CJS import
```typescript
const { Interval } = require('react-time-formatter/Interval');
```

## Guideline
There's only one guideline.
### Avoid early or unnecessary dereference
**❌ Incorrect:**
Although this may seem to work fine, `HH`, `mm` and `ss` occur before any logic happens which may lead to incorrect results in some cases.
```tsx
<Interval from={DateA} to={DateB}>
  {({ HH, mm, ss }) => <span>{HH}:{mm}:{ss}</span>}
</Interval>
```
**✅ Correct:**
Safe. Each unit is referenced only when it's needed.
```tsx
<Interval from={DateA} to={DateB}>
  {t => <span>{t.HH}:{t.mm}:{t.ss}</span>}
</Interval>
```
**❌ Incorrect:**
Whenever unit is referenced (e.g. `t.hours`) it's assumed to be used.
```tsx
<Interval from={DateA} to={DateB}>
  {t => {
    if (t.hours < 2) return <span>{t.mm}:{t.ss}</span>
    return (<span>{t.HH}:{t.mm}:{t.ss}</span>)
  }}
</Interval>
```
_For 80 minutes will output → 20:00_
_(since hours are referenced at `t.hours` will assume "01:20:00" is being rendered)_

**✅ Correct:**
Use `total*` units for conditions when applicable:
```tsx
<Interval from={DateA} to={DateB}>
  {t => {
    if (t.totalHours < 2) return <span>{t.mm}:{t.ss}</span>
    return (<span>{t.HH}:{t.mm}:{t.ss}</span>)
  }}
</Interval>
```
_For 80 minutes will correctly render → 80:00_

 **✅ Also correct:**
Use units that are gonna be used under either condition:
```tsx
<Interval from={DateA} to={DateB}>
  {t => {
    if (t.minutes < 2) return <span>{t.mm}:{t.ss}</span>
    return (<span>{t.HH}:{t.mm}:{t.ss}</span>)
  }}
</Interval>
```
_For 80 minutes will correctly render → 80:00_

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
<DateTime at={new Date('2025-02-05T15:08:09.998')}>
  {dt => <span>{dt.hh}:{dt.mm} {dt.A} {dt.MM}/{dt.DD} {dt.YYYY}</span>}
</DateTime>
```
 _→ 03:08 PM 02/05 2025_
##### Pre-formatted keys
Recommended for insertion, since they're already of `string` type and support readable error-state in form of `#` or `--` symbols for cases when correct date can't be displayed.

| Token     | Type     | Description                  | Example          | Invalid   |
| --------- | -------- | ---------------------------- | ---------------- | --------- |
| `dt.YY`   | `string` | 2-digit year                 | `"25"`           | `"##"`    |
| `dt.YYYY` | `string` | 4-digit year                 | `"2025"`         | `"####"`  |
| `dt.M`    | `string` | Month (1–12)                 | `"2"` (February) | `"#"`     |
| `dt.MM`   | `string` | 2-digit month                | `"02"`           | `"##"`    |
| `dt.D`    | `string` | Day of the month (1–31)      | `"5"`            | `"#"`     |
| `dt.DD`   | `string` | 2-digit day of the month     | `"05"`           | `"##"`    |
| `dt.d`    | `string` | Day of week (1 = Monday)     | `"1"`            | `"#"`     |
| `dt.H`    | `string` | Hour (24h)                   | `"15"`           | `"##"`    |
| `dt.HH`   | `string` | 2-digit hour (24h)           | `"15"`           | `"##"`    |
| `dt.h`    | `string` | Hour (12h)                   | `"3"`            | `"#"`     |
| `dt.hh`   | `string` | 2-digit hour (12h)           | `"03"`           | `"##"`    |
| `dt.m`    | `string` | Minute                       | `"8"`            | `"#"`     |
| `dt.mm`   | `string` | 2-digit minute               | `"08"`           | `"##"`    |
| `dt.s`    | `string` | Second                       | `"9"`            | `"#"`     |
| `dt.ss`   | `string` | 2-digit second               | `"09"`           | `"##"`    |
| `dt.SSS`  | `string` | Milliseconds (3-digit)       | `"998"`          | `"###"`   |
| `dt.A`    | `string` | Meridiem (uppercase)         | `"AM"` / `"PM"`  | `"--"`    |
| `dt.a`    | `string` | Meridiem (lowercase)         | `"am"` / `"pm"`  | `"--"`    |
| `dt.Z`    | `string` | UTC offset (`+hh:mm` or `Z`) | `"+10:00"`       | `"##:##"` |
| `dt.ZZ`   | `string` | UTC offset (`+hhmm`)         | `"+1000"`        | `"####"`  |
##### Raw keys
Are always of `number` type. Recommended for conditional logic and debugging, will turn into `NaN` when the input is incorrect.

| Token               | Type     | Example        | Note                                         |
| ------------------- | -------- | -------------- | -------------------------------------------- |
| `dt.year`           | `number` | `2025`         |                                              |
| `dt.month`          | `number` | `2` (february) | 1-indexed                                    |
| `dt.date`           | `number` | `5`            |                                              |
| `dt.day`            | `number` | `1`            | Day of the week (1 = Monday)                 |
| `dt.hours`          | `number` | `15`           |                                              |
| `dt.minutes`        | `number` | `8`            |                                              |
| `dt.seconds`        | `number` | `9`            |                                              |
| `dt.milliseconds`   | `number` | `998`          |                                              |
| `dt.timezoneOffset` | `number` | `-600`         | In minutes: for example `-180` means `UTC+3` |

### Duration
`Duration` is a **fixed quantity of time units, independent of specific dates** or positions on a timeline.
> ❗ For Duration **`years` are approximated to 365 days** and **`months` are approximated to `30 days`.**  Use [Interval](#Interval) if these units need to be precisely reflected.
#### Props
- `of:` `number` [`RelativeTime`](#RelativeTime) — The quantity of time in milliseconds or arbitrary units
- `children?:` [`Render`](#Render) — Render function
- `render?:` [`Render`](#Render) — Render function (alias for `children`)
#### Output
Passed to render function and abbreviated as `t` in this doc.

```tsx
<Duration of={4800000}>
  {t => <span>{t.HH} hours {t.mm} minutes</span>}
</Duration>
```
 _→ 01 hours 20 minutes_
##### Pre-formatted keys
Recommended for insertion, since they're already of `string` type and support readable error-state in form of `#` symbols for cases when correct duration can't be displayed.

| Unit    | Type     | Description             | Example | Invalid |
| ------- | -------- | ----------------------- | ------- | ------- |
| `t.Y`   | `string` | Years (1–2 digits)      | `"5"`   | `"#"`   |
| `t.YY`  | `string` | 2-digit years           | `"05"`  | `"##"`  |
| `t.M`   | `string` | Months (1–2 digits)     | `"2"`   | `"#"`   |
| `t.MM`  | `string` | 2-digit months          | `"02"`  | `"##"`  |
| `t.W`   | `string` | Weeks (1–2 digits)      | `"2"`   | `"#"`   |
| `t.WW`  | `string` | 2-digit weeks           | `"02"`  | `"##"`  |
| `t.D`   | `string` | Days (1–2 digits)       | `"4"`   | `"#"`   |
| `t.DD`  | `string` | 2-digit days            | `"04"`  | `"##"`  |
| `t.H`   | `string` | Hours (1–2 digits)      | `"15"`  | `"##"`  |
| `t.HH`  | `string` | 2-digit hours           | `"15"`  | `"##"`  |
| `t.m`   | `string` | Minutes (1–2 digits)    | `"8"`   | `"#"`   |
| `t.mm`  | `string` | 2-digit minutes         | `"08"`  | `"##"`  |
| `t.s`   | `string` | Seconds (1–2 digits)    | `"9"`   | `"#"`   |
| `t.ss`  | `string` | 2-digit seconds         | `"09"`  | `"##"`  |
| `t.SSS` | `string` | Milliseconds (3 digits) | `"998"` | `"###"` |
##### Raw unit values
Are always of `number` type and either **positive** or 0, never negative. Recommended for conditional logic and debugging, will turn into `NaN` when the input is incorrect.

| Unit             | Type     | Example | Note                                                    |
| ---------------- | -------- | ------- | ------------------------------------------------------- |
| `t.years`        | `number` | `5`     | For **Duration** years are approximated to **365 days** |
| `t.months`       | `number` | `2`     | For **Duration** months are approximated to **30 days** |
| `t.weeks`        | `number` | `2`     | Is defined as chunk of 7 days                           |
| `t.days`         | `number` | `4`     |                                                         |
| `t.hours`        | `number` | `15`    |                                                         |
| `t.minutes`      | `number` | `8`     |                                                         |
| `t.seconds`      | `number` | `9`     |                                                         |
| `t.milliseconds` | `number` | `998`   |                                                         |
##### Total values
Independent from the rest of keys and their insertion doesn't affect formatting rules. Each key represents the **whole duration** converted to a single unit. Are always of `number` type and can be both **positive or negative** or 0. Will also turn into `NaN` when the input is incorrect.

| Key                   | Type     | Example        | Note                                                     |
| --------------------- | -------- | -------------- | -------------------------------------------------------- |
| `t.totalYears`        | `number` | `5`            | For **Duration** years are approximated to **365 days**  |
| `t.totalMonths`       | `number` | `62`           | For **Duration** months are approximated to **365 days** |
| `t.totalWeeks`        | `number` | `271`          |                                                          |
| `t.totalDays`         | `number` | `1903`         |                                                          |
| `t.totalHours`        | `number` | `45687`        |                                                          |
| `t.totalMinutes`      | `number` | `2741228`      |                                                          |
| `t.totalSeconds`      | `number` | `164473689`    |                                                          |
| `t.totalMilliseconds` | `number` | `164473689998` |                                                          |

### Interval
`Interval` is a **calendar-aware span between two dates.** Unlike [Duration](#Duration) Interval **accounts for** the variable length of `months` and `years`.
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
  {t => <span>{t.YY} years {t.MM} months {t.DD} days</span>}
</Interval>
```
 _→ 10 years 03 months 26 days_
##### Pre-formatted keys
Recommended for insertion, since they're already of `string` type and support readable error-state in form of `#` symbols for cases when correct duration can't be displayed.

| Unit    | Type     | Description             | Example | Invalid |
| ------- | -------- | ----------------------- | ------- | ------- |
| `t.Y`   | `string` | Years (1–2 digits)      | `"5"`   | `"#"`   |
| `t.YY`  | `string` | 2-digit years           | `"05"`  | `"##"`  |
| `t.M`   | `string` | Months (1–2 digits)     | `"2"`   | `"#"`   |
| `t.MM`  | `string` | 2-digit months          | `"02"`  | `"##"`  |
| `t.W`   | `string` | Weeks (1–2 digits)      | `"2"`   | `"#"`   |
| `t.WW`  | `string` | 2-digit weeks           | `"02"`  | `"##"`  |
| `t.D`   | `string` | Days (1–2 digits)       | `"4"`   | `"#"`   |
| `t.DD`  | `string` | 2-digit days            | `"04"`  | `"##"`  |
| `t.H`   | `string` | Hours (1–2 digits)      | `"15"`  | `"##"`  |
| `t.HH`  | `string` | 2-digit hours           | `"15"`  | `"##"`  |
| `t.m`   | `string` | Minutes (1–2 digits)    | `"8"`   | `"#"`   |
| `t.mm`  | `string` | 2-digit minutes         | `"08"`  | `"##"`  |
| `t.s`   | `string` | Seconds (1–2 digits)    | `"9"`   | `"#"`   |
| `t.ss`  | `string` | 2-digit seconds         | `"09"`  | `"##"`  |
| `t.SSS` | `string` | Milliseconds (3 digits) | `"998"` | `"###"` |
##### Raw unit values
Are always of `number` type and either **positive** or 0, never negative. Recommended for conditional logic and debugging, will turn into `NaN` when the input is incorrect.

| Unit             | Type     | Example |
| ---------------- | -------- | ------- |
| `t.years`        | `number` | `5`     |
| `t.months`       | `number` | `2`     |
| `t.weeks`        | `number` | `2`     |
| `t.days`         | `number` | `4`     |
| `t.hours`        | `number` | `15`    |
| `t.minutes`      | `number` | `8`     |
| `t.seconds`      | `number` | `9`     |
| `t.milliseconds` | `number` | `998`   |
##### Total values
Independent from the rest of keys and their insertion doesn't affect formatting rules. Each key represents the **whole duration** converted to a single unit. Are always of `number` type and can be both **positive or negative** or 0. Will also turn into `NaN` when the input is incorrect.

| Key                   | Type     | Example        |
| --------------------- | -------- | -------------- |
| `t.totalYears`        | `number` | `5`            |
| `t.totalMonths`       | `number` | `62`           |
| `t.totalWeeks`        | `number` | `271`          |
| `t.totalDays`         | `number` | `1903`         |
| `t.totalHours`        | `number` | `45687`        |
| `t.totalMinutes`      | `number` | `2741228`      |
| `t.totalSeconds`      | `number` | `164473689`    |
| `t.totalMilliseconds` | `number` | `164473689998` |

## Timezone
Timezones are applicable to `DateTime` or `Interval` components. The only correct way to apply timezone is via **`timezone` prop**. Having timezone in the date-string itself DOES NOT affect how the date will be displayed. Without **`timezone` prop** the timezone **defaults to local**.

**❌ Incorrect:**
Setting timezone right inside the date string. It will only affect how the date will be interpreted.
```tsx
<DateTime at='2025-02-05T12:00+01:00'>
  {dt => <span>It's {dt.HH}:{dt.mm} in Belgrade!</span>}
</DateTime>
```

**✅ Correct:**
Applying timezone via **`timezone` prop:**
```tsx
import { DateTime } from 'react-time-formatter';
import Belgrade from 'react-time-formatter/tz/Europe/Belgrade'
```
You can still put timezone offset inside the date string, just keep in mind it will only affect parsing process and not formatting.
```tsx
<DateTime at='2025-02-05T12:00+01:00' timezone={Belgrade}>
  {dt => <span>It's {dt.HH}:{dt.mm} in Belgrade!</span>}
</DateTime>
```
 _→ It's 12:00 in Belgrade!_

> ❗ [Pre-made](#Pre-made%20timezones) and [automatic](#Automatic%20timezones) timezones are dependent on [Int.DateTimeFormat API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) which is widely available across browsers. But if you need even more control, refer to [custom timezones](#Custom%20timezones) section.
### Pre-made timezones
The most basic pre-made timezones can be enabled by just strings, these timezones include: `"Local"` (also is default) and `"UTC"`:
```tsx
<DateTime at={Date.now()} timezone="UTC">
  {dt => <span>It's {dt.HH}:{dt.mm} UTC!</span>}
</DateTime>
```
 _→ It's 11:00 UTC!_
##### To statically apply a pre-made timezone you can import it from its `tz/` path:
Each path corresponds to the IANA name:
```tsx
import { DateTime } from 'react-time-formatter';
import Belgrade from 'react-time-formatter/tz/Europe/Belgrade'
```
Just pass it to timezone prop:
```tsx
<DateTime at={Date.now()} timezone={Belgrade}>
  {dt => <span>It's {dt.HH}:{dt.mm} in Belgrade!</span>}
</DateTime>
```
 _→ It's 12:00 in Belgrade!_

### Automatic timezones
If you want to apply the timezone dynamically or the desired timezone is absent from the pre-made timezones list, you can use `createTimezone` helper that will create a timezone for you.
##### To create an automatic timezone, just pass its IANA name:
```tsx
import { DateTime } from 'react-time-formatter';
import { createTimezone } from 'react-time-formatter/tz/createTimezone'

const Tokyo = createTimezone('Asia/Tokyo');
```
Similarly, just pass it to timezone prop:
```tsx
<DateTime at={Date.now()} timezone={Tokyo}>
  {dt => <span>It's {dt.HH}:{dt.mm} in Tokyo!</span>}
</DateTime>
```
 _→ It's 10:00 in Tokyo!_
##### Invalid timezones will never produce a valid-looking result:
```tsx
import { DateTime } from 'react-time-formatter';
import { createTimezone } from 'react-time-formatter/tz/createTimezone'

const What = createTimezone('Invalid/Unknown');
```

```tsx
<DateTime at={Date.now()} timezone={What}>
  {dt => <span>It's always {dt.HH}:{dt.mm} in the invalid timezone!</span>}
</DateTime>
```
 _→ It's always ##:## in the invalid timezone!_
### Custom Timezones
Custom timezones are defined by a **TimezoneOffsetResolver** function `(date: Date) => number` which takes single `Date` argument and returns timezone offset **in minutes**. Static timezones (with no DST) may also be just defined as number.
##### The simplest custom timezone:
Just a static UTC+3 offset:
```tsx
const UTC3 = () => -180;
```
Also valid:
```tsx
const UTC3 = -180;
```
Note that `-180` translates into `UTC+3`. Timezone offset is consistent with JS `Date.prototype.getTimezoneOffset()` function that defines timezone offset as **how many minutes should be added to local timezone to get UTC**.
```tsx
<DateTime at={Date.now()} timezone={UTC3}>
  {dt => <span>UTC{t.ZZ} time is {dt.HH}:{dt.mm}</span>}
</DateTime>
```
 _→ UTC+0300 time is 14:00_
##### The custom implementation of the local timezone:
Local timezone is applied by default so you don't normally have to implement it. But if you had to, it would look like this:
```typescript
const Local = (date: Date) => date.getTimezoneOffset();
```
##### The custom implementation of the Berlin timezone with its DST rules:
In case you can't rely on browser's timezone implementation and need your timezone to always have the same behaviour, you can define your all DST rules explicitly:
```tsx
// The manual equivalent of createTimezone('Europe/Berlin') call:
const Berlin = (date: Date): number => {
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
```

```tsx
<DateTime at={Date.now()} timezone={Berlin}>
  {dt => <span>It's {dt.HH}:{dt.mm} in Berlin!</span>}
</DateTime>
```
 _→ It's 01:00 in Berlin!_
## Type reference
### CalendarDate
Can act as input for: [DateTime](#DateTime), [Interval](#Interval)
Matching type is returned by: [DateTime](#DateTime)

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
Can act as input for: [Duration](#Duration)
Matching type is returned by: [Duration](#Duration), [Interval](#Interval)

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

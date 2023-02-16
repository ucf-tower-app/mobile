// The following is adapted from a now out-of-date timestamp formatter at
// https://www.npmjs.com/package/react-timestamp/v/5.0.0?activeTab=readme
// all credit goes to its author.

import { useState, useEffect } from 'react';
import {
  toDate,
  secondsBetweenDates,
  YEAR,
  distanceOfTimeInWords,
  formatDate,
  FormatOptions,
} from '../../utils/react-timestamp-utils';
import { Text } from 'native-base';

type Props = {
  date: Date | number | string;
  relative?: boolean;
  relativeTo?: Date | number | string;
  options?: FormatOptions;
  autoUpdate?: boolean;
  fontSize?: string;
  color?: string;
};

export default function Timestamp({
  date,
  relative,
  relativeTo,
  options,
  autoUpdate,
  fontSize = 'xs',
  color = 'grey',
}: Props) {
  const [minutes, setMinutes] = useState<number>(0);
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => setMinutes(minutes + 1), 60000);
    return () => clearInterval(interval);
  }, [autoUpdate, minutes]);

  let possibleDate = toDate(date);
  if (possibleDate === null) return null;

  const relativeToDate: Date = toDate(relativeTo) || new Date();
  const seconds = secondsBetweenDates(possibleDate, relativeToDate);
  const isRelative = (relative && Math.abs(seconds) < YEAR) || relativeTo;
  const text: string = isRelative
    ? distanceOfTimeInWords(seconds, !relativeTo, options?.translate)
    : formatDate(possibleDate, options);

  return (
    <Text fontSize={fontSize} color={color}>
      {text}
    </Text>
  );
}

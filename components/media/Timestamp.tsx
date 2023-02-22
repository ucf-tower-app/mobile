// The following is adapted from a now out-of-date timestamp formatter at
// https://www.npmjs.com/package/react-timestamp/v/5.0.0?activeTab=readme
// all credit goes to its author.

import { Text } from 'native-base';
import { useEffect, useState } from 'react';
import {
  distanceOfTimeInWords,
  formatDate,
  FormatOptions,
  secondsBetweenDates,
  toDate,
  YEAR,
} from '../../utils/react-timestamp-utils';

type Props = {
  date: Date | number | string;
  relative?: boolean;
  relativeTo?: Date | number | string;
  options?: FormatOptions;
  autoUpdate?: boolean;
  fontSize?: string;
  color?: string;
  mini?: boolean;
};

export default function Timestamp({
  date,
  relative,
  relativeTo,
  options,
  autoUpdate,
  mini = false,
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
  const formatText: string = isRelative
    ? distanceOfTimeInWords(seconds, !relativeTo, options?.translate)
    : formatDate(possibleDate, options);

  const text = mini
    ? formatText.split(' ')[0] === 'Just'
      ? 'Now'
      : formatText.split(' ')[0] + formatText.split(' ')[1].charAt(0)
    : formatText;

  return (
    <Text numberOfLines={1} fontSize={fontSize} color={color}>
      {text}
    </Text>
  );
}

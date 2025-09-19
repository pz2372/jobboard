export const FormatDate = (date: Date) => {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return newDate.toLocaleDateString("en-US", options);
};

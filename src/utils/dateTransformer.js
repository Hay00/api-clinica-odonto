function SqlDateToBrl(date, showHour = false) {
  if (showHour) return new Date(date).toLocaleDateString('pt-br');
  return new Date(date).toLocaleDateString('pt-br');
}

module.exports = {
  SqlDateToBrl,
};

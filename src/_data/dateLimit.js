const d = new Date();
d.setDate(d.getDate() - 120);

module.exports = new Date(d).getTime();

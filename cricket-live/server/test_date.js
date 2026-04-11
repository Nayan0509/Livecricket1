const dateStr = "1775901600000";
const num = 1775901600000;

try {
   console.log("number array", new Date(num).toLocaleDateString());
   console.log("string", new Date(dateStr).toISOString());
} catch(e) {
  console.log("err", e.message);
}

try {
  console.log("parse num", new Date(parseInt(dateStr)).toISOString());
} catch(e) {
   console.log("err2", e.message);
}

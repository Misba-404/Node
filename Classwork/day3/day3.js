const studentNAme = "Rahul";
const correctAnswers = 4;
const wrongAnsers = 1;
function getFinalScore(name, correct, wrong) {
  let calculate =
    name == "Unknown"
      ? "inavlid Student name"
      : `Score:${4 * correct - 1 * wrong}`;
  console.log(calculate);
}
getFinalScore (studentNAme, correctAnswers, wrongAnsers);

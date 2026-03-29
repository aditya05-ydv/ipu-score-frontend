// ============================================================
// IPU GRADE UTILITIES — Based on Official Ordinance 11
// ============================================================

export const GRADES = [
  { min: 90, max: 100, g: 'O',  gp: 10, color: '#3dffa0' },
  { min: 75, max: 89,  g: 'A+', gp: 9,  color: '#4f7fff' },
  { min: 65, max: 74,  g: 'A',  gp: 8,  color: '#7c9fff' },
  { min: 55, max: 64,  g: 'B+', gp: 7,  color: '#ffd166' },
  { min: 50, max: 54,  g: 'B',  gp: 6,  color: '#ffb347' },
  { min: 45, max: 49,  g: 'C',  gp: 5,  color: '#ff8c42' },
  { min: 40, max: 44,  g: 'P',  gp: 4,  color: '#ff6cb0' },
  { min: 0,  max: 39,  g: 'F',  gp: 0,  color: '#ff4d6d' },
];

export const gradeByMarks = (m) => {
  const n = Number(m);
  if (isNaN(n) || m === '') return null;
  return GRADES.find((g) => n >= g.min && n <= g.max) || GRADES[GRADES.length - 1];
};

export const gradeByGP = (gp) => GRADES.find((g) => g.gp === Number(gp));

export const gradeByLetter = (l) => GRADES.find((g) => g.g === l);

// Official IPU formula: Percentage = CGPA × 10
export const toPercent = (cgpa) => (cgpa * 10).toFixed(1);

// Division as per Ordinance 11, Clause 13
export const getDivision = (cgpa) => {
  if (cgpa >= 10)  return { label: 'Exemplary Performance', color: '#3dffa0', bg: 'rgba(61,255,160,0.12)' };
  if (cgpa >= 6.5) return { label: 'First Division',        color: '#4f7fff', bg: 'rgba(79,127,255,0.12)' };
  if (cgpa >= 5.0) return { label: 'Second Division',       color: '#ffd166', bg: 'rgba(255,209,102,0.12)' };
  if (cgpa >= 4.0) return { label: 'Third Division',        color: '#ff8c42', bg: 'rgba(255,140,66,0.12)' };
  return { label: 'Below Minimum', color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' };
};

// SGPA = Σ(Ci × Gi) / Σ(Ci)
export const calcSGPA = (subjects) => {
  let totalCredits = 0;
  let totalPoints = 0;
  subjects.forEach((s) => {
    const c = Number(s.credits);
    const gp = Number(s.gp);
    if (c > 0 && !isNaN(gp)) {
      totalCredits += c;
      totalPoints += c * gp;
    }
  });
  return totalCredits > 0
    ? { sgpa: totalPoints / totalCredits, credits: totalCredits }
    : null;
};

// CGPA = ΣΣ(Cni × Gni) / ΣΣ(Cni)
export const calcCGPA = (semesters) => {
  let totalCredits = 0;
  let totalPoints = 0;
  semesters.forEach((s) => {
    if (s.result) {
      totalCredits += s.result.credits;
      totalPoints += s.result.credits * s.result.sgpa;
    }
  });
  return totalCredits > 0
    ? { cgpa: totalPoints / totalCredits, credits: totalCredits }
    : null;
};

// Subject factory
let _id = 100;
export const newSubject = () => ({
  id: _id++,
  name: '',
  credits: '',
  marks: '',
  gp: '',
});

export const SEM_NAMES = [
  'Sem 1','Sem 2','Sem 3','Sem 4',
  'Sem 5','Sem 6','Sem 7','Sem 8',
];
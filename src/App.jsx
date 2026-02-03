import React, { useState, useEffect } from 'react';
import { MODULES, TOTAL_COEF } from './constants';
import GradeInput from './components/GradeInput';
import ResultCard from './components/ResultCard';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

function App() {
  const [grades, setGrades] = useState({});
  const [average, setAverage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleGradeChange = (id, value) => {
    if (value === '') {
      setGrades(prev => ({ ...prev, [id]: '' }));
      return;
    }

    let numValue = parseFloat(value);
    if (numValue > 20) value = '20';
    if (numValue < 0) value = '0';

    setGrades(prev => ({
      ...prev,
      [id]: value
    }));
  };

  useEffect(() => {
    let totalScore = 0;

    MODULES.forEach(mod => {
      const grade = parseFloat(grades[mod.id]) || 0;
      totalScore += grade * mod.coef;
    });

    setAverage(totalScore / TOTAL_COEF);
  }, [grades]);

  const saveToFirebase = async () => {
    try {
      setIsSaving(true);
      await addDoc(collection(db, "grades"), {
        average: parseFloat(average.toFixed(2)),
        details: grades,
        createdAt: serverTimestamp()
      });
      alert('Saved successfully!');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Error saving. Check console for details (likely missing API keys).');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-4xl mx-auto">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10 w-full"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Semester 1
        </h1>
        <p className="text-gray-400 text-lg uppercase tracking-wider">Average Calculator</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Modules List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-semibold text-white">Modules</h2>
            <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
              Total Coef: {TOTAL_COEF}
            </span>
          </div>

          <div className="space-y-3">
            {MODULES.map(mod => (
              <GradeInput
                key={mod.id}
                module={mod}
                value={grades[mod.id] || ''}
                onChange={handleGradeChange}
              />
            ))}
          </div>
        </div>

        {/* Result Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <ResultCard
              average={average}
              onSave={saveToFirebase}
              isSaving={isSaving}
            />

            <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
              <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Highest Module</span>
                  <span className="text-white">
                    {Object.entries(grades).length > 0 ?
                      (Math.max(...Object.values(grades).map(v => parseFloat(v) || 0))).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Lowest Module</span>
                  <span className="text-white">
                    {Object.entries(grades).length > 0 ?
                      (Math.min(...Object.values(grades).map(v => parseFloat(v) || 0))).toFixed(2)
                      : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

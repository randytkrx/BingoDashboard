import { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SHEET_ID = '1CRoqK3szGdhIIlXG0gKA9BhjmRROmNba0tlur2V7qnM';
const API_KEY = 'AIzaSyBZchFlW_joIa7CnSSacm8oalKQqYayhyk';
const RANGE = 'Points!A8:M';

export default function SummaryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
      .then(res => res.json())
      .then(json => {
        const rows = json.values || [];
        const teamCols = [7, 8, 9, 10, 11, 12]; // Columns H-M = team1-6
        const teamTotals = Array(6).fill(0);
        const teamCompleted = Array(6).fill(0);

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row[3]?.toLowerCase().includes("max points")) continue;
          const itemName = row[4];
          if (/[0-9]/.test(itemName)) continue;
          const pts = parseFloat(row[5]) || 0;

          teamCols.forEach((colIdx, teamIdx) => {
            if (row[colIdx] && row[colIdx].toString().trim() === '1') {
              teamCompleted[teamIdx] += pts;
            }
            teamTotals[teamIdx] += pts;
          });
        }

        const result = teamTotals.map((total, i) => ({
          team: `Team${i + 1}`,
          points: teamCompleted[i],
          completion: ((teamCompleted[i] / total) * 100).toFixed(1)
        }));

        setData(result);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Bingo Team Progress</h1>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Points by Team</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="points" name="Points" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Completion %</h2>
          <ul className="space-y-2">
            {data.map(t => (
              <li key={t.team} className="flex justify-between">
                <span>{t.team}</span>
                <span>{t.completion}%</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

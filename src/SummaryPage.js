import { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SHEET_ID = '1CRoqK3szGdhIIlXG0gKA9BhjmRROmNba0tlur2V7qnM';
const API_KEY = 'AIzaSyBZchFlW_joIa7CnSSacm8oalKQqYayhyk';
const RANGE = 'Points!A8:M';

export default function SummaryPage() {
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    )
      .then(res => res.json())
      .then(json => {
        const rows = json.values || [];
        const teamCols = [7, 8, 9, 10, 11, 12]; // Columns H-M = team1-6
        const teamTotals = Array(6).fill(0);
        const teamCompleted = Array(6).fill(0);

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const itemName = row[4];
          if (!itemName || /\d/.test(itemName)) continue;

          const pts = parseFloat(row[5]) || 0;
          if (pts === 0) continue;

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
        setTeams(result.map(t => t.team));
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bingo Team Progress</h1>

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

      <footer className="text-center text-sm text-muted mt-6">
        Made by s59 for Mercenary Clan
      </footer>
    </div>
  );
}

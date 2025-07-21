import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SHEET_ID = '1CRoqK3szGdhIIlXG0gKA9BhjmRROmNba0tlur2V7qnM';
const API_KEY = 'AIzaSyBZchFlW_joIa7CnSSacm8oalKQqYayhyk';
const RANGE = 'Points!A8:M';

export default function App() {
  const [chartData, setChartData] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
      .then(res => res.json())
      .then(json => {
        const rows = json.values || [];
        const teamCols = [7, 8, 9, 10, 11, 12];
        const teamNames = ['Team1', 'Team2', 'Team3', 'Team4', 'Team5', 'Team6'];
        const teamTotals = Array(6).fill(0);
        const teamCompleted = Array(6).fill(0);
        const heatmap = {};
        let currentBoss = null;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const boss = row[3] || currentBoss;
          const pts = parseFloat(row[5]) || 0;
          if (row[3]) currentBoss = row[3];

          if (!heatmap[currentBoss]) {
            heatmap[currentBoss] = Array(6).fill(0);
          }

          teamCols.forEach((colIdx, teamIdx) => {
            if (row[colIdx] && row[colIdx].toString().trim() === '1') {
              teamCompleted[teamIdx] += pts;
              heatmap[currentBoss][teamIdx] += pts;
            }
            teamTotals[teamIdx] += pts;
          });
        }

        const summary = teamNames.map((name, i) => ({
          team: name,
          points: teamCompleted[i],
          completion: ((teamCompleted[i] / teamTotals[i]) * 100).toFixed(1)
        }));

        setChartData(summary);
        setHeatmapData(heatmap);
      });
  }, []);

  const teamNames = ['Team1', 'Team2', 'Team3', 'Team4', 'Team5', 'Team6'];

  return (
    <div>
      <h1>Bingo Team Progress</h1>

      <h2>Points by Team</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="team" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="points" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: 40 }}>Boss Drop Completion (Heatmap)</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Boss</th>
            {teamNames.map(team => (
              <th key={team}>{team}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(heatmapData).map(([boss, points]) => (
            <tr key={boss}>
              <td><b>{boss}</b></td>
              {points.map((pts, idx) => (
                <td key={idx} style={{
                  backgroundColor: `rgba(0, 255, 0, ${Math.min(1, pts / 30).toFixed(2)})`
                }}>
                  {pts.toFixed(1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

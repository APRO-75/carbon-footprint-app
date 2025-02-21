import { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function App() {
  const [inputs, setInputs] = useState({ transport: '', food: '', energy: '' });
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Handle input changes
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/calculate', {
        transport: parseFloat(inputs.transport) || 0,
        food: parseFloat(inputs.food) || 0,
        energy: parseFloat(inputs.energy) || 0,
      });
      setResult(response.data.carbon_footprint);

      // Prepare chart data
      setChartData([
        { name: 'Transport', value: parseFloat(inputs.transport) * 0.21 || 0 },
        { name: 'Food', value: parseFloat(inputs.food) * 2.5 || 0 },
        { name: 'Energy', value: parseFloat(inputs.energy) * 0.5 || 0 },
      ]);
    } catch (error) {
      console.error('Error calculating carbon footprint:', error);
      setResult('Error');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Carbon Footprint Calculator 🌱</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <div>
          <input
            type="number"
            name="transport"
            placeholder="Transport (km)"
            value={inputs.transport}
            onChange={handleChange}
            style={{ padding: '0.5rem', margin: '0.5rem' }}
          />
        </div>
        <div>
          <input
            type="number"
            name="food"
            placeholder="Food (kg)"
            value={inputs.food}
            onChange={handleChange}
            style={{ padding: '0.5rem', margin: '0.5rem' }}
          />
        </div>
        <div>
          <input
            type="number"
            name="energy"
            placeholder="Energy (kWh)"
            value={inputs.energy}
            onChange={handleChange}
            style={{ padding: '0.5rem', margin: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
          Calculate
        </button>
      </form>

      {result !== null && (
        <div>
          <h2>Your Carbon Footprint: {result} kg CO₂</h2>

          {/* Pie Chart */}
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          {/* Suggestions */}
          <div style={{ marginTop: '1rem' }}>
            <h3>🌟 Tips to Reduce Your Carbon Footprint:</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {inputs.transport > 50 && <li>🚲 Consider biking or using public transport more often.</li>}
              {inputs.food > 5 && <li>🥦 Reduce meat consumption and opt for plant-based meals.</li>}
              {inputs.energy > 30 && <li>💡 Switch to energy-efficient appliances and turn off unused devices.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

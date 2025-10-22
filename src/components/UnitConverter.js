import React, { useState } from 'react';

export default function UnitConverter() {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('GB');
  const [result, setResult] = useState('');

  const convert = () => {
    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) {
      setResult('請輸入有效的數字');
      return;
    }
    if (unit === 'GB') {
      setResult(`${inputValue} GB 等於 ${inputValue * 1024} MB`);
    } else {
      setResult(`${inputValue} MB 等於 ${(inputValue / 1024).toFixed(2)} GB`);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>MB GB 換算</h2>
      <div style={{ width: '300px', margin: 'auto' }}>
        <label>請輸入數值:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="輸入數字"
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
        />
        <label>請選擇單位 (MB or GB?):</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
        >
          <option value="GB">GB</option>
          <option value="MB">MB</option>
        </select>
        <button onClick={convert} style={{ width: '100%', padding: '8px', margin: '10px 0' }}>
          換算
        </button>
        <p>{result}</p>
      </div>
    </div>
  );
}

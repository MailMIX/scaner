import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, Typography, Tooltip } from '@mui/material';

const ScannerPage = () => {
  const [scannerData, setScannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.fansvor.ru/api/scanner');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Обновляем состояние с полученными данными
        setScannerData(data);
      } catch (error) {
        console.error('Ошибка при получении данных: ', error);
      } finally {
        // Завершаем загрузку
        setIsLoading(false);
      }
    };

    fetchData(); // Вызываем функцию для получения данных
  }, []); // Зависимость пустая, чтобы сделать запрос только один раз при монтировании компонента

  const renderNetworks = (networks) => {
    if (!networks || networks.length === 0) {
      return <span>Нет доступных сетей</span>; // Возвращаем текст, если нет сетей
    }

    return networks.map((network) => (
      <Tooltip key={network.id} title={network.info ? network.info.network + ": " + (network.info.withdrawFee || 0) : ""} arrow>
        <span style={{ color: network.deposit ? 'green' : 'red' }}>{network.network}</span>
      </Tooltip>
    ));
  };
  
  // Основной компонент для отображения результатов
  return (
    <div style={{maxWidth: 1200}}>
      <Typography variant="h4" gutterBottom>
        Результаты сканирования
      </Typography>
      {isLoading ? (
        <Typography variant="h6">Загрузка...</Typography>
      ) : (
        <TableContainer sx={{ minWidth: 1050 }} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Валютная пара</TableCell>
                <TableCell align="right">Биржа продажи</TableCell>
                <TableCell align="right">Цена продажи</TableCell>
                <TableCell align="right">Биржа покупки</TableCell>
                <TableCell align="right">Цена покупки</TableCell>
                <TableCell align="right">Профит (%)</TableCell>
                <TableCell align="right">Сети депозита</TableCell>
                <TableCell scope='row' align="right">Сети вывода</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scannerData.map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell component="th" scope="row">
                    {row.symbol}
                  </TableCell>
                  <TableCell align="right">{row.exchangeSell}</TableCell>
                  <TableCell align="right">{row.sellPrice}</TableCell>
                  <TableCell align="right">{row.exchangeBuy}</TableCell>
                  <TableCell align="right">{row.buyPrice}</TableCell>
                  <TableCell align="right">{row.profitPercent.toFixed(2)}</TableCell>
                  <TableCell align="right">{renderNetworks(row.networks.buyNetworks)}</TableCell> {/* Изменено на buyNetworks */}
                  <TableCell align="right">{renderNetworks(row.networks.sellNetworks)}</TableCell> {/* Изменено на sellNetworks */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ScannerPage;
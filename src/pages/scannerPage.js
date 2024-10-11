import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, Typography, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';

const PARS_PER_PAGE = 50; // Количество пар на странице

function ScannerPage() {
  const [scannerData, setScannerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Получаем данные частями
        let data = {};
        let chunkIndex = 0;
        while (true) {
          const response = await axios.get(`http://localhost:5000/api/scanner?chunk=${chunkIndex}`);
          const chunk = await response.json();
          if (Object.keys(chunk).length === 0) {
            break;
          }
          data = { ...data, ...chunk };
          chunkIndex++;

          // Сортируем данные по прибыли
          const sortedData = Object.entries(data).sort((a, b) => b[1].relativeProfit - a[1].relativeProfit);

          // Преобразуем данные в массив для отображения в таблице
          const scannerData = sortedData.map(([key, pairData]) => ({
            ...pairData,
            currencyPair: pairData.symbol, // Добавляем поле currencyPair
          }));

          setScannerData(scannerData);
        }
      } catch (error) {
        console.error('Ошибка при получении данных сканера:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Получаем данные для текущей страницы
  const currentPars = scannerData.slice((currentPage - 1) * PARS_PER_PAGE, currentPage * PARS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Результаты сканирования
      </Typography>
      {isLoading ? (
        <Stack sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Пара / Биржи</TableCell>
                  <TableCell align="right">Прибыль (%)</TableCell>
                  <TableCell align="right">Время жизни</TableCell>
                  <TableCell align="right">Сеть</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPars.map((pair, index) => (
                  <TableRow key={index}>
                    <TableCell align='left'>
                      <Typography variant="body2">
                        {pair.currencyPair} / {pair.exchange1} - {pair.exchange2}
                      </Typography>
                      <Typography variant="body2">
                        {pair.exchange1}: {pair.price1}
                      </Typography>
                      <Typography variant="body2">
                        {pair.exchange2}: {pair.price2}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{pair.relativeProfit}%</TableCell>
                    <TableCell align="right">{Math.round((Date.now() - pair.timestamp) / 60000)} мин.</TableCell> {/* Время жизни в минутах */}
                    <TableCell align="right">
                      {pair.networks && pair.networks.map((network, idx) => (
                        <Typography key={idx} color={pair.networks[network].withdraw ? 'green' : 'red'}>
                          {network}
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/*  Дополнительно: Пагинация */}
          {/*  Реализуйте компонент пагинации и передайте props currentPage и handlePageChange */}
        </>
      )}
    </div>
  );
}

export default ScannerPage;
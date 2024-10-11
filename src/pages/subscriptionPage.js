import React, { useContext, useEffect, useState } from 'react';
import { Typography, Box, Button, Grid, TextField, Card, CardContent, CardActions } from '@mui/material';
import AuthContext from '../authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const { user } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка данных подписок с backend
    axios.get('/api/subscriptions/get', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => {
        setSubscriptions(res.data.subscriptions);
      })
      .catch(err => {
        console.error('Ошибка загрузки данных подписок:', err);
      });
  }, [user]); 

  const handleSubscribe = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/subscriptions/add', { subscription: selectedSubscription }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setSubscriptions([...subscriptions, response.data.subscription]); 
      navigate('/profile'); //  Перенаправление  на  страницу  профиля
    } catch (error) {
      console.error('Ошибка подписки:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Ваши Подписки
          </Typography>
          <ul>
            {subscriptions.map(subscription => (
              <li key={subscription._id}>
                <Typography variant="body1">{subscription.name}</Typography>
              </li>
            ))}
          </ul>

          <Typography variant="h6" gutterBottom>
            Выберите подписку
          </Typography>

          {/*  Карточки  с  подписками  */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Bronze
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {/*  Характеристики  подписки  Bronze  */}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Цена: {/*  Цена  подписки  Bronze  */}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={() => setSelectedSubscription('Bronze')}>
                    Подписаться
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Silver
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {/*  Характеристики  подписки  Silver  */}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Цена: {/*  Цена  подписки  Silver  */}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={() => setSelectedSubscription('Silver')}>
                    Подписаться
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Gold
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {/*  Характеристики  подписки  Gold  */}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Цена: {/*  Цена  подписки  Gold  */}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="contained" color="primary" onClick={() => setSelectedSubscription('Gold')}>
                    Подписаться
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Button variant="contained" color="secondary" fullWidth onClick={handleSubscribe}>
            Подписаться
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionPage;
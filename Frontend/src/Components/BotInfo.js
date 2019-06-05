import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import API from '../services/API';

const BotInfo = ({ lastSuccess, maxPrice, paused, id, update, change }) => (
  <Card style={{ width: '100vw' }}>
    <CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Данные бота
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Лимит цены: {maxPrice}.
          {!paused ? ` Последнее успешное обновление: ${(Date.now() - lastSuccess) / 1000} секунд назад.` : ' Бот остановлен.'}
        </Typography>
      </CardContent>
    </CardActionArea>
    <CardActions>
      <Button
        size="small"
        color="primary"
        onClick={paused ? (() => update(() => API.activateBots(id))) : (() => update(() => API.pauseBots(id)))}
      >
        {paused ? 'Активировать бота' : 'Остановить бота'}
      </Button>
      <Button size="small" color="primary" onClick={() => update()}>
        Обновить информацию
      </Button>
      <Button size="small" color="primary" onClick={() => change(id)}>
        Изменить информацию
      </Button>
    </CardActions>
  </Card>
);

export default BotInfo;
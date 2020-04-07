import { notification } from 'antd';

const openNotification = (type) => {
  notification[type]({
    message: 'Delete successfully',
    placement: 'bottomRight',
  });
};

export default openNotification;

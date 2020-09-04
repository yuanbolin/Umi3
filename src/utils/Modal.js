import {Modal} from 'antd';
import { history } from 'umi';
export const Success_modal_time_list = (props) => {
    let secondsToGo = 3;
    let {title} = props;
    const modal = Modal.success({
        title: title,
        content: `${secondsToGo}秒后跳转到列表页面。`,
        onOk:()=>{
            clearInterval(timer);
            clearTimeout(timeout);
          history().goBack();
        }
    });
    const timer = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
            content: `${secondsToGo}秒后跳转到列表页面。`,
        });
    }, 1000);
    const timeout = setTimeout(() => {
        clearInterval(timer);
        modal.destroy();
      history().goBack();
    }, secondsToGo * 1000);

}
export const Success_modal = (info) => {
     Modal.success({
        title: info
    });
}

export const Error_modal = (info) => {
    Modal.error({
        title: info
    });
}

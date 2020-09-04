import React from 'react';
import { Badge, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { get, CancelAxiosRequest } from '@/utils/http';
import styles from './Index.less';
import NoticeList from './NoticeList';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // this.getNotices();
    // this.interval = window.setInterval(this.getNotices , 60000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
    if (CancelAxiosRequest) CancelAxiosRequest();
    this.setState = (state, callback) => {};
  }

  getNotices = () => {
    get('notice-undos/getNoticeUndoList').then(res => {
      this.setState({ data: res.data });
    });
  };

  clearMsg = list => {
    const data = {
      ids: JSON.stringify(list),
    };
    get('notice-undos/read-batch', data).then(res => {
      this.getNotices();
    });
  };

  clearDb = list => {
    const data = {
      ids: JSON.stringify(list),
    };
    get('notice-undos/do-batch', data).then(res => {
      this.getNotices();
    });
  };

  render() {
    return (
      <div className={styles.noticeButton} style={{ float: 'right', marginRight: 30 }}>
        <Dropdown
          overlay={
            <NoticeList data={this.state.data} propsUrl={this.props} clearMsg={this.clearMsg} clearDb={this.clearDb} />
          }
        >
          <Badge className='badge' count={this.state.data.length}>
            <BellOutlined className='icon' />
          </Badge>
        </Dropdown>
      </div>
    );
  }
}
export default Index;

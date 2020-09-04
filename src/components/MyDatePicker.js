import { DatePicker } from 'antd';
import React from 'react';
import moment from 'moment';

const modeValue = {
  date: 0,
  month: 1,
  year: 2,
  decade: 3,
};

class MyDatePicker extends React.Component {
  static defaultProps = {
    topMode: 'year',
    defaultValue: null,
    value: null,
    format: 'YYYY',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || this.props.defaultValue,
      mode: this.props.topMode,
      preMode: this.props.topMode,
    };
    this.isOnChange = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.topMode !== nextProps.topMode) {
      this.setState({
        mode: nextProps.topMode,
      });
    }
  }

  /**
   *
   * @param {*} value
   * @param {要打開面板} mode
   */
  onPanelChange(value, mode) {
    // console.log(`onPanelChange date:${value} mode:${mode}`);
    // mode==null默認是從year返回到month
    mode = mode || 'month';
    let open = true;
    // 1. 往上打開，沒有任何問題，直接打開
    if (modeValue[this.state.mode] > modeValue[mode] && modeValue[this.props.topMode] > modeValue[mode]) {
      // 向下
      open = false;
      mode = this.props.topMode;
    }
    // 只關閉窗口和賦值，當前的mode不變
    this.setState({
      value,
      open,
      mode,
      preMode: this.state.mode,
    });

    this.props.myonchange(value);
  }

  /**
   * 在date的情況下選擇直接退出
   */
  onChange(value, dateStr) {
    if (value === null) {
      // 取消选择（点击 删除x 小按钮）
      this.props.myonchange('');
    }
    // console.log(`onChange date:${value} dateStr:${dateStr}`);
    this.isOnChange = true;
    this.setState({
      open: false,
      value,
    });
  }

  render() {
    // console.log(`state:${JSON.stringify(this.state)}`);
    return (
      <DatePicker
        value={this.state.value}
        mode={this.state.mode}
        open={this.state.open}
        format={this.props.format}
        onFocus={() => !this.isOnChange && ((this.isOnChange = !this.isOnChange), this.setState({ open: true }))}
        onChange={this.onChange.bind(this)}
        onPanelChange={this.onPanelChange.bind(this)}
        onOpenChange={open => this.setState({ open })}
      />
    );
  }
}

export default MyDatePicker;

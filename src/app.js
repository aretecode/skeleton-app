import Inferno from 'inferno';
import Component from 'inferno-component';

class Eh extends Component {
  static propTypes = {
    canada: String,
  }
  state = {
    igloo: true,
  }
  componentWillMount() {
    // before it renders
    this.setState({ igloo: false }, () => {
      console.log('set state is set, can also use setStateSync');
    });
  }

  render() {
    console.log(this.state);
    return <h1>eh</h1>;
  }
}

module.exports = Eh;

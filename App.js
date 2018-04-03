import React, { Component } from "react";
import R from "ramda";
import Svg, { Circle, Path, Text } from "react-native-svg";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const getPointOnCircle = angle => {
  const radians = angle * (Math.PI / 180);
  const cx = width / 2;
  const cy = height / 2;
  const radius = 150;
  const newPoint = {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
  return newPoint;
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.left = getPointOnCircle(270).x;
    this.top = getPointOnCircle(270).y;
    this.panResponder = {};
    this.buttonRadius = 150;
    this.progressRadius = 80;

    this.state = {
      left: new Animated.Value(this.left),
      top: new Animated.Value(this.top),
      angle: new Animated.Value(270)
    };

    this.state.left.addListener(left => {
      this._myCircle.setNativeProps({ cx: left.value.toString() });
    });
    this.state.top.addListener(top => {
      this._myCircle.setNativeProps({ cy: top.value.toString() });
    });
    this.state.angle.addListener(angle => {
      this._progress.setNativeProps({ d: this._calculatePath(angle.value) });
    });
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: this._handlePanResponderMove
    });
  }

  _animate = (xCoordinate, yCoordinate, angle) => {
    // Didn't quite work.
    // if (
    //   this.state.angle._value >= 270 &&
    //   this.state.angle._value <= 280 &&
    //   xCoordinate > this.state.left._value
    // ) {
    //   xCoordinate = this._getPointOnCircle(270).x;
    //   yCoordinate = this._getPointOnCircle(270).y;
    //   angle = 270;
    // }
    Animated.spring(this.state.left, {
      toValue: xCoordinate,
      restDisplacementThreshold: 1,
      speed: 100
    }).start();
    Animated.spring(this.state.top, {
      toValue: yCoordinate,
      speed: 100,
      restDisplacementThreshold: 1
    }).start();
    Animated.spring(this.state.angle, {
      toValue: angle,
      speed: 100,
      restDisplacementThreshold: 1
    }).start();
  };

  _calculatePath = angle => {
    return `M${this._getPointOnPath(270).x} ${this._getPointOnPath(270).y} A ${
      this.progressRadius
    } ${this.progressRadius} 0 ${this._calculateArcLength(angle)} 0 ${
      this._getPointOnPath(angle).x
    } ${this._getPointOnPath(angle).y}`;
  };

  _getPointOnPath = angle => {
    const radians = angle * (Math.PI / 180);
    const cx = width / 2;
    const cy = height / 2;
    const newPoint = {
      x: cx + this.progressRadius * Math.cos(radians),
      y: cy + this.progressRadius * Math.sin(radians)
    };
    return newPoint;
  };

  _calculateArcLength = angle => {
    if (angle <= 180 && angle >= 90) {
      return 0;
    }
    if (angle <= 90 && angle >= 0) {
      return 1;
    }
    if (angle <= 360 && angle >= 270) {
      return 1;
    }

    if (angle <= 270 && angle >= 180) {
      return 0;
    }
  };

  _calculateAngle = (x, y) => {
    const zeroPoints = { zx: width / 2, zy: height / 2 };
    let newAngle =
      Math.atan2(y - zeroPoints.zy, x - zeroPoints.zx) * (180 / Math.PI);
    if (newAngle < 0) {
      newAngle = 360 + newAngle;
    }
    return newAngle;
  };

  _getPointOnCircle = angle => {
    const radians = angle * (Math.PI / 180);
    const cx = width / 2;
    const cy = height / 2;
    const newPoint = {
      x: cx + this.buttonRadius * Math.cos(radians),
      y: cy + this.buttonRadius * Math.sin(radians)
    };
    return newPoint;
  };

  _handlePanResponderMove = (e, gestureState) => {
    const { moveX, moveY } = gestureState;
    const angle = this._calculateAngle(moveX, moveY);
    const nextPoint = this._getPointOnCircle(angle);
    this._animate(nextPoint.x, nextPoint.y, angle);
  };

  _getPercentage = angle => {
    if (angle > 270 && angle < 360) {
      return Math.round(Math.abs(angle - 270) / 360 * 100);
    } else {
      return Math.round(100 - Math.abs(angle - 270) / 360 * 100);
    }
  };

  render() {
    return (
      <View>
        <Svg height={height.toString()} width={width.toString()}>
          <AnimatedCircle
            ref={ref => (this._myCircle = ref)}
            cx={this.left}
            cy={this.top}
            r="25"
            fill="gray"
            {...this._panResponder.panHandlers}
          />
          <Circle
            cx={width / 2}
            cy={height / 2}
            stroke="red"
            strokeWidth={40}
            r={this.progressRadius}
            fill="transparent"
          />
          <Path
            ref={ref => (this._progress = ref)}
            stroke="blue"
            strokeWidth={40}
            fill="none"
            d={`M${this._getPointOnPath(270).x} ${
              this._getPointOnPath(270).y
            } A ${this.progressRadius} ${
              this.progressRadius
            } 0 ${this._calculateArcLength(0)} 0 ${
              this._getPointOnPath(270).x
            } ${this._getPointOnPath(270).y}`}
          />
        </Svg>
      </View>
    );
  }
}

import React, { useState, useEffect, useRef } from 'react';

import { getRotationDegrees } from '../../utils';
import { rouletteSelector } from '../common/images';
import {
  RouletteContainer,
  RouletteSelectorImage,
  RotationContainer,
} from './styles';
import {
  DEFAULT_BACKGROUND_COLORS,
  DEFAULT_TEXT_COLORS,
  DEFAULT_OUTER_BORDER_COLOR,
  DEFAULT_OUTER_BORDER_WIDTH,
  DEFAULT_INNER_RADIUS,
  DEFAULT_INNER_BORDER_COLOR,
  DEFAULT_INNER_BORDER_WIDTH,
  DEFAULT_RADIUS_LINE_COLOR,
  DEFAULT_RADIUS_LINE_WIDTH,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_DISTANCE,
} from '../../strings';
import { WheelData } from './types';
import WheelCanvas from '../WheelCanvas';

interface Props {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: WheelData[];
  onStopSpinning?: () => any;
  backgroundColors?: string[];
  textColors?: string[];
  outerBorderColor?: string;
  outerBorderWidth?: number;
  innerRadius?: number;
  innerBorderColor?: string;
  innerBorderWidth?: number;
  radiusLineColor?: string;
  radiusLineWidth?: number;
  fontSize?: number;
  perpendicularText?: boolean;
  textDistance?: number;
  width?: number;
  height?: number;
  startSpinningTime?: number;
  continueSpinningTime?: number;
  stopSpinningTime?: number;
}

const STARTED_SPINNING = 'started-spinning';

const DEFAULT_START_SPINNING_TIME = 2600;
const DEFAULT_CONTINUE_SPINNING_TIME = 750;
const DEFAULT_STOP_SPINNING_TIME = 8000;

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 900;

export const Wheel = ({
  mustStartSpinning,
  prizeNumber,
  data,
  onStopSpinning = () => null,
  backgroundColors = DEFAULT_BACKGROUND_COLORS,
  textColors = DEFAULT_TEXT_COLORS,
  outerBorderColor = DEFAULT_OUTER_BORDER_COLOR,
  outerBorderWidth = DEFAULT_OUTER_BORDER_WIDTH,
  innerRadius = DEFAULT_INNER_RADIUS,
  innerBorderColor = DEFAULT_INNER_BORDER_COLOR,
  innerBorderWidth = DEFAULT_INNER_BORDER_WIDTH,
  radiusLineColor = DEFAULT_RADIUS_LINE_COLOR,
  radiusLineWidth = DEFAULT_RADIUS_LINE_WIDTH,
  fontSize = DEFAULT_FONT_SIZE,
  perpendicularText = false,
  textDistance = DEFAULT_TEXT_DISTANCE,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  startSpinningTime = DEFAULT_START_SPINNING_TIME,
  continueSpinningTime = DEFAULT_CONTINUE_SPINNING_TIME,
  stopSpinningTime = DEFAULT_STOP_SPINNING_TIME
}: Props) => {
  const wheelData = useRef<WheelData[]>([...data]);
  const [startRotationDegrees, setStartRotationDegrees] = useState(0);
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const mustStopSpinning = useRef<boolean>(false);

  useEffect(() => {
    const dataLength = data.length;
    wheelData.current = [...data];
    for (let i = 0; i < dataLength; i++) {
      wheelData.current[i] = {
        ...data[i],
        style: {
          backgroundColor:
            data[i].style?.backgroundColor ||
            backgroundColors[i % backgroundColors.length],
          textColor:
            data[i].style?.textColor || textColors[i % textColors.length],
        },
      };
    }
    setIsDataUpdated(true);
  }, [data, backgroundColors, textColors]);

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);
      startSpinning();
      const finalRotationDegreesCalculated = getRotationDegrees(
        prizeNumber,
        data.length
      );
      setFinalRotationDegrees(finalRotationDegreesCalculated);
    }
  }, [mustStartSpinning]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false);
      setStartRotationDegrees(finalRotationDegrees);
    }
  }, [hasStoppedSpinning]);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setHasStoppedSpinning(false);
    mustStopSpinning.current = true;
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false;
        setHasStartedSpinning(false);
        setHasStoppedSpinning(true);
        onStopSpinning();
      }
    }, startSpinningTime + continueSpinningTime + stopSpinningTime - 300);
  };

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return '';
  };

  if (!isDataUpdated) {
    return null;
  }

  return (
    <RouletteContainer>
      <RotationContainer
        className={getRouletteClass()}
        startSpinningTime={startSpinningTime}
        continueSpinningTime={continueSpinningTime}
        stopSpinningTime={stopSpinningTime}
        startRotationDegrees={startRotationDegrees}
        finalRotationDegrees={finalRotationDegrees}
      >
        <WheelCanvas
          width={width ? width.toString() : DEFAULT_WIDTH.toString()}
          height={height ? height.toString() : DEFAULT_HEIGHT.toString()}
          data={wheelData.current}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          fontSize={fontSize}
          perpendicularText={perpendicularText}
          textDistance={textDistance}
        />
      </RotationContainer>
      <RouletteSelectorImage src={rouletteSelector.src} alt="roulette-static" />
    </RouletteContainer>
  );
};

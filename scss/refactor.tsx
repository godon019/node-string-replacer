import Icon from '../Icon/Icon';
import React from 'react';
import { borderRadius } from '../../styles/mixins';
import classNames from 'classnames';
import { components } from '../../styles/components';
import styled from 'styled-components';

interface Props {
  name?: string;
  type?: string;
  title?: string;
  disabled?: boolean;
  visible?: boolean;
  primary?: boolean;
  danger?: boolean;
  large?: boolean;
  xLarge?: boolean;
  icon?: string;
  namespace?: string;
}

const Button = (props): React.ReactElement<Props> => {
  const {
    title,
    disabled,
    visible,
    primary,
    large,
    xLarge,
    danger,
    className,
    namespace,
    ...restProps
  } = props;

  const renderIcon = () => {
    const { icon, namespace } = props;
    if (!icon) return null;
    return <Icon icon={icon} namespace={namespace} />;
  };

  const handleOnClick = (event) => {
    if (!props.disabled && props.onClick) props.onClick(event);
  };

  return (
    <Container
      // {...restProps}
      // visible={true}
      className={classNames(
        // styles.button,
        {
          primary,
          danger,
          large,
          xLarge,
          'visibility-Visible': visible,
          'visibility-Hide': !visible,
          // [styles.buttonDisabled]: disabled,
          // [styles['visibility-Visible']]: visible,
          // [styles['visibility-Hide']]: !visible,
        },
        className,
      )}
      disabled={disabled}
      onClick={handleOnClick}
    >
      {renderIcon()}
      <span>{title}</span>
    </Container>
  );
};

export default Button;

const Container = styled.button`
  /* height: $height-default; */
  height: ${components.heightDefault};
  width: 100%;
  min-width: 80px;
  padding: 0;
  border-style: inherit;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #f3f4f6;
  box-shadow: 0 1px 3px 0 rgba(81, 99, 120, 0.1);
  border-color: #d9d9d9 #ccc #b3b3b3;

  /* @include border-radius($border-radius-default); */
  ${borderRadius(components.borderRadiusDefault)}

  /* border: 1px solid ${({ theme }) => theme.colors.borderDark}; */
  border: 1px solid ${({ theme }) => theme.colors.borderDark};

  /* color: ${({ theme }) => theme.colors.textLight}; */
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  text-align: center;
  position: relative;
  /* @include user-select-none(); */
  
  transition: ${components.transitionDefault};
  margin: ${components.marginDefault};
  outline: 0;

  i {
    font-size: 14px;
    position: absolute;
    left: 16px;
    line-height: ${components.heightDefault};
  }

  span {
    /* font-size: $font-size-default; */
    font-size: ${components.fontSizeDefault};
    /* font-weight: $font-weight-default; */
    font-weight: ${components.fontWeightDefault};
    /* line-height: $height-default; */
    line-height: ${components.heightDefault};
  }


  :hover:enabled {
    background-color: #e7eaee;
    box-shadow: 0 2px 4px 0 rgba(81, 99, 120, 0.2);
  }

  :active:enabled {
    background-color: #dbe0e5;
  }

  :focus:enabled {
    border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  }

  :disabled {
    color: ${({ theme }) => theme.colors.textDisabled};
    background-color: ${({ theme }) => theme.colors.widgetDisabledLighter};
    border: 1px solid ${({ theme }) => theme.colors.widgetDisabledLight};
    cursor: default;
  }
  
  &.primary {
    color: ${({ theme }) => theme.colors.textDark};
    border: 1px solid ${({ theme }) => theme.colors.primaryDark};
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &.primary:hover:enabled {
    background-color: ${({ theme }) => theme.colors.primaryDarker};
  }

  &.primary:active:enabled {
    background-color: ${({ theme }) => theme.colors.primaryDarkest};
  } 
 


  &.danger {
    color: ${({ theme }) => theme.colors.textDark};
    border: 1px solid ${({ theme }) => theme.colors.warmPink};
    background-color: ${({ theme }) => theme.colors.warmPink};
  }

  &.danger:hover:enabled {
    background-color: ${({ theme }) => theme.colors.warmPinkDarker};
  }

  &.danger:active:enabled {
    background-color: ${({ theme }) => theme.colors.warmPinkDarkest};
  }

  &.large {
    height: $height-large;
    padding: 0;
    margin: $margin-large;
    box-shadow: 0 2px 4px 0 rgba(81, 99, 120, 0.1);
    @include border-radius($border-radius-large);

    i {
      font-size: 22px;
      line-height: $height-large;
    }

    span {
      font-size: $font-size-large;
      font-weight: $font-weight-large;
      line-height: $height-large;
    }
  }

  &.large:hover:enabled {
    box-shadow: 0 4px 6px 0 rgba(81, 99, 120, 0.2);
  }


  &.xLarge {
    @extend .large;
    height: $height-x-large;
    margin: $margin-x-large;
    @include border-radius($border-radius-x-large);

    i {
      font-size: 22px;
      line-height: $height-x-large;
    }

    span {
      font-size: $font-size-x-large;
      font-weight: $font-weight-x-large;
      line-height: $height-x-large;
    }
  }
`;

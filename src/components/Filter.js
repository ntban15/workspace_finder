import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  filterTextStyle: {
    fontSize: 15,
    marginRight: 15,
  },
  selectedfilterTextStyle: {
    fontSize: 15,
    marginRight: 15,
    fontWeight: 'bold',
    color: '#0054A5',
  },
});

const renderFilterText = (option, selected, onSelectionChange, index, len) => {
  const { id, text } = option;
  const { selectedfilterTextStyle, filterTextStyle } = styles;
  const isSelected = id === selected;

  const filterText = [
    <Text
      key={id}
      style={isSelected ? selectedfilterTextStyle : filterTextStyle}
      onPress={() => onSelectionChange(id)}
    >
      {(isSelected ? '• ' : '') + text || id}
    </Text>,
  ];

  const dash = (
    <Text key={`${id}|`} style={filterTextStyle} onPress={() => onSelectionChange(id)}>
      |
    </Text>
  );

  if (index < len - 1) {
    filterText.push(dash);
  }

  return filterText;
};

const Filter = ({ selected, options, onSelectionChange }) => (
  <View style={styles.container}>
    {options.map((option, index) =>
      renderFilterText(option, selected, onSelectionChange, index, options.length))}
  </View>
);

Filter.propTypes = {
  selected: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
  })).isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default Filter;

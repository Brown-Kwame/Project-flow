import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTimeSelector = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date'); // or 'time'

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View>
      <Button onPress={() => { setShow(true); setMode('date'); }} title="Pick Date" />
      <Button onPress={() => { setShow(true); setMode('time'); }} title="Pick Time" />
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DateTimeSelector;
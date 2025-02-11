import { useCounterStore } from '@/stores/counter';
import { Box, Button, Text } from '@chakra-ui/react';

export default function CounterWithStorePage() {
  return (
    <Box display={'flex'} justifyContent={'center'} marginTop={'128px'}>
      <CounterDisplay />
      <CounterAdd />
      <CounterSubtract />
    </Box>
  );
}

function CounterDisplay() {
  const counter = useCounterStore((state) => state.counter);

  return <Text>{counter}</Text>;
}

function CounterAdd() {
  const add = useCounterStore((state) => state.add);

  return <Button onClick={add}>Tambah</Button>;
}

function CounterSubtract() {
  const subtract = useCounterStore((state) => state.subtract);

  return <Button onClick={subtract}>Kurang</Button>;
}

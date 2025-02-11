import { Box, Button, Text } from '@chakra-ui/react';
import { useState } from 'react';

export default function CounterPage() {
  const [counter, setCounter] = useState<number>(0);

  function add() {
    setCounter(counter + 1);
  }

  function subtract() {
    setCounter(counter - 1);
  }

  return (
    <Box display={'flex'} justifyContent={'center'} marginTop={'128px'}>
      <CounterDisplay counter={counter} />
      <CounterAdd add={add} />
      <CounterSubtract subtract={subtract} />
    </Box>
  );
}

function CounterDisplay({ counter }: { counter: number }) {
  return <Text>{counter}</Text>;
}

function CounterAdd({ add }: { add(): void }) {
  return <Button onClick={add}>Tambah</Button>;
}

function CounterSubtract({ subtract }: { subtract(): void }) {
  return <Button onClick={subtract}>Kurang</Button>;
}

import React, { useState } from 'react';
import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  Avatar,
  useMantineTheme,
} from '@mantine/core';
import {
  name,
  jobTitle,
  streetAddress,
  cityName,
  domainName,
  month,
  number,
} from 'minifaker';
import 'minifaker/locales/en';

export default function App(): JSX.Element {
  const theme = useMantineTheme();
  const refresh = useState({})[1];

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  const gender = Math.random() > 0.5 ? 'female' : 'male';
  const apiGender = gender === 'female' ? 'women' : 'men';

  return (
    <div style={{ width: 480, margin: 'auto' }}>
      <Card shadow="sm" padding="xl" withBorder={true}>
        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
        >
          <Group style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
            <Avatar
              src={`https://randomuser.me/api/portraits/${apiGender}/${number({
                min: 0,
                max: 99,
              })}.jpg`}
              alt="User"
              color="indigo"
            />
            <Text weight={500}>{name({ gender })}</Text>
          </Group>
          <Badge color="pink" variant="light">
            {domainName()}
          </Badge>
        </Group>

        <Text size="sm" style={{ color: secondaryColor, lineHeight: 2.5 }}>
          <Text size="sm" color="dimmed">
            Job
          </Text>
          {jobTitle()}
          <Text size="sm" color="dimmed">
            Address
          </Text>
          {streetAddress()}, {cityName()}
          <Text size="sm" color="dimmed">
            Started
          </Text>
          {month()} {number({ min: 2000, max: 2021 })}
        </Text>

        <Button
          variant="light"
          color="blue"
          fullWidth
          style={{ marginTop: 14 }}
          onClick={refresh}
        >
          Generate another profile
        </Button>
      </Card>
    </div>
  );
}

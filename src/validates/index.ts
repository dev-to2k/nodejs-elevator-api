export function validateElevatorRequest(
  body: any
): { floor: number; direction: number } | { error: string } {
  const { floor, direction, elevatorId } = body;

  if (floor === undefined || direction === undefined) {
    return { error: "Missing 'floor' or 'direction' information" };
  }

  const floorNumber = Number(floor);
  const directionNumber = Number(direction);

  if (isNaN(floorNumber) || isNaN(directionNumber)) {
    return { error: "'floor' and 'direction' must be invalid numbers" };
  }

  if (floorNumber < 1 || floorNumber > 10) {
    return { error: "'floor' must be between 1 and 10" };
  }

  if (![-1, 0, 1].includes(directionNumber)) {
    return { error: "'direction' must be -1, 0 or 1" };
  }

  return { floor: floorNumber, direction: directionNumber };
}

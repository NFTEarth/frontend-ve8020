import {
  GOERLI_VOTING_GAUGES,
  MAINNET_VOTING_GAUGES,
  veNFTE_VOTING_GAUGE,
} from './voting-gauges';
test('exports voting gauges', () => {
  expect(MAINNET_VOTING_GAUGES.length).toBeGreaterThan(100);

  expect(GOERLI_VOTING_GAUGES).toHaveLength(2);

  expect(veNFTE_VOTING_GAUGE).toBeInstanceOf(Object);
});

import addresses from './addresses.json';
import { address } from './data-types';

export function getAddressByState(name: string) {
  const addressList: address[] = addresses.address;
  const filteredList = addressList.filter((address: address) => address.state === name);
  if (filteredList.length < 0) {
    throw new Error("unable to find the address with state name as '" + name + "'");
  }
  let randomIndex = Math.random() * (filteredList.length - 1 - 0) + 0;
  return filteredList.at(randomIndex);
}

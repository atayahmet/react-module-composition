import container from '../../container';
import { makeKey } from '../../utils';

type ResetProps = {
  identifier?: string;
};

const Reset: React.FC<ResetProps> = () => {
  const keyGen = makeKey();
  container.remove(keyGen.hooks());

  container.remove(keyGen.modules());

  container.remove(keyGen.options());

  return null;
};

export default Reset;

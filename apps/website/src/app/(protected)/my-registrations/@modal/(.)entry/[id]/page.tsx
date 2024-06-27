import { getUserRaceEntryById } from '@/actions/raceEntryActions';
import { Suspense } from 'react';

import { Modal } from '@/components/Modal';
import { EditRaceEntry } from '@/components/editRaceEntryById';

const RaceEntryPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const raceEntry = await getUserRaceEntryById(+id);
  console.log(`raceEntries`, raceEntry);
  if (!raceEntry) {
    return null;
  }
  return (
    <Modal>
      <Suspense>
        <EditRaceEntry raceEntry={raceEntry} />
      </Suspense>
    </Modal>
  );
};

export default RaceEntryPage;

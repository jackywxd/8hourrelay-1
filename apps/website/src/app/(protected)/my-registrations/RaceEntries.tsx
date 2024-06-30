import { IUserAllRaceEntries } from '@/actions/raceEntryActions';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { RaceEntryCreateButton } from '@/components/race-create-button';
import { RaceEntriesList } from '@/components/RaceEntriesList';
import { Card, CardContent } from '@/components/ui/card';

async function MyRacePage({
  raceEntries,
}: {
  raceEntries: IUserAllRaceEntries | null;
}) {
  return (
    <div className="flex flex-col">
      {raceEntries?.length ? (
        <Card>
          <CardContent>
            <div className="flex w-full justify-around pt-2">
              <span className="hidden md:block">Category</span>
              <span>Name</span>
              <span>Email</span>
              <span className="hidden md:block">Team</span>
              <span className="hidden md:block">Payment</span>
            </div>
            <RaceEntriesList raceEntries={raceEntries} />
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="trophy" />
          <EmptyPlaceholder.Title>No race entry</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any race entry yet.
          </EmptyPlaceholder.Description>
          <RaceEntryCreateButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </div>
  );
}

export default MyRacePage;

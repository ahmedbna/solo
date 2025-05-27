import { Id } from '@/convex/_generated/dataModel';
import { FetchAgency } from '@/components/dashboard/fetch-agency';

type Props = {
  params: { id: Id<'agencies'> };
};

export default async function AgencyPage({ params }: Props) {
  const { id } = await params;

  return <FetchAgency agencyId={id} />;
}

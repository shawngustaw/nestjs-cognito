import { Authorization } from '@nestjs-cognito/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { MantaDto } from './dto/manta.dto';

@Resolver()
@Authorization({
  requiredGroups: ['manta'],
  prohibitedGroups: ['dolphin', 'shark', 'whale'],
})
export class MantaResolver {
  @Query(() => MantaDto)
  getRay() {
    return new MantaDto('Ray');
  }
}

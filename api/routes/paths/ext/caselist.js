// These paths are ones that require a caselist_key
import getPersonChapters from '../../../controllers/ext/caselist/getPersonChapters';
import getPersonRounds from '../../../controllers/ext/caselist/getPersonRounds';
import getPersonStudents from '../../../controllers/ext/caselist/getPersonStudents';
import postCaselistLink from '../../../controllers/ext/caselist/postCaselistLink';
import getPersonReputation from '../../../controllers/ext/caselist/getPersonReputation';

export default [
	{ path: '/caselist/chapters', module : getPersonChapters },
	{ path: '/caselist/rounds', module : getPersonRounds },
	{ path: '/caselist/students', module : getPersonStudents },
	{ path: '/caselist/reputation', module : getPersonReputation },
	{ path: '/caselist/link', module : postCaselistLink },
];

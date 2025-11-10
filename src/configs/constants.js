export const APP_NAME = "TUES Repo";

export const PATHS = {
  ALL: "*",
  ID_PATH_VARIABLE: "/:id",
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  USER: "/user",
  REGISTER_AUTHOR: "/register-author",
  ADMIN: "/admin",
  STAFF: "/staff",
  AUTHOR: "/author",
  DEPARTMENT: "/department",
  DOCUMENT: "/document",
  SUBMISSION: "/submission",
};

export const API_PATHS = {
  AUTHENTICATE: "/authenticate",
  SIGN_OUT: "/sign-out",
  REGISTER: "/register",
  USER: "/user",
  PUBLIC: "/public",
  ADMIN: "/admin",
  STAFF: "/staff",
  AUTHOR: "/author",
  DEPARTMENT: "/department",
  FIND_BY: "/find-by",
  BLOCK: "/block",
  PASSWORD: "/password",
  DOCUMENT: "/document",
  CONTRIBUTOR: "/contributor",
  DISSERTATION: "/dissertation",
  CONFERENCE_PROCEEDINGS: "/conference-proceedings",
  CONFERENCE_PAPER: "/conference-paper",
  BOOK: "/book",
  BOOK_CHAPTER: "/book-chapter",
  REPORT: "/report",
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  AUTHOR: 'AUTHOR',
};

export const DEPARTMENT_TYPES = {
  FACULTY: 'FACULTY',
  CONFERENCE: 'CONFERENCE',
};

export const DEPARTMENT_TYPE_LIST = [
  DEPARTMENT_TYPES.FACULTY,
  DEPARTMENT_TYPES.CONFERENCE,
];

export const INITIAL_DEPARTMENT_FORM_DATA = {
  depType: DEPARTMENT_TYPES.FACULTY,
  nameUz: "",
  nameEn: "",
  nameRu: "",
  isBlocked: false,
};

export const INITIAL_USER_FORM_DATA = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  middleName: "",
  departmentId: null,
};

export const LIST_LIMIT = 10;

export const USER_ROLE_FILTER_OPTIONS = {
  ALL: "ALL",
  ADMIN: USER_ROLES.ADMIN,
  STAFF: USER_ROLES.STAFF,
  AUTHOR: USER_ROLES.AUTHOR,
};

export const USER_ROLE_FILTER_LIST = [
  USER_ROLE_FILTER_OPTIONS.ALL,
  USER_ROLES.ADMIN,
  USER_ROLES.STAFF,
  USER_ROLES.AUTHOR,
];

export const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$/;
export const ROR_REGEX = /^0[a-hj-km-np-tv-z0-9]{6}\d{2}$/;

export const DOC_TYPES = {
  DISSERTATION: "DISSERTATION",
  CONFERENCE_PROCEEDINGS: "CONFERENCE_PROCEEDINGS",
  CONFERENCE_PAPER: "CONFERENCE_PAPER",
  BOOK: "BOOK",
  BOOK_CHAPTER: "BOOK_CHAPTER",
  REPORT: 'REPORT',
};

export const DOC_TYPE_LIST = [
  DOC_TYPES.DISSERTATION,
  DOC_TYPES.CONFERENCE_PROCEEDINGS,
  DOC_TYPES.CONFERENCE_PAPER,
  DOC_TYPES.BOOK,
  DOC_TYPES.BOOK_CHAPTER,
  DOC_TYPES.REPORT,
];

export const DOC_ROLES = {
  AUTHOR: 'AUTHOR',
  REVIEWER: 'REVIEWER',
  EDITOR: 'EDITOR',
  SUPERVISOR: 'SUPERVISOR',
};

export const DOC_ROLE_LIST = [
  DOC_ROLES.AUTHOR,
  DOC_ROLES.REVIEWER,
  DOC_ROLES.EDITOR,
  DOC_ROLES.SUPERVISOR,
];

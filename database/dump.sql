--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.publications DROP CONSTRAINT publications_fk1;
ALTER TABLE ONLY public.publications DROP CONSTRAINT publications_fk0;
ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_fk0;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_fk0;
ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_fk0;
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "account-profile-links_fk1";
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "account-profile-links_fk0";
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pk;
ALTER TABLE ONLY public.accounts DROP CONSTRAINT "unique-accounts";
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "unique-account-profile-links";
ALTER TABLE ONLY public.publications DROP CONSTRAINT publications_pk;
ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_pk;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pk;
ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pk;
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "account-profile-links_pk";
ALTER TABLE public.users ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE public.publications ALTER COLUMN "publicationId" DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN "profileId" DROP DEFAULT;
ALTER TABLE public.posts ALTER COLUMN "postId" DROP DEFAULT;
ALTER TABLE public.accounts ALTER COLUMN "accountId" DROP DEFAULT;
ALTER TABLE public."account-profile-links" ALTER COLUMN "linkId" DROP DEFAULT;
DROP SEQUENCE public."users_userId_seq";
DROP TABLE public.users;
DROP SEQUENCE public."publications_publicationId_seq";
DROP TABLE public.publications;
DROP SEQUENCE public."profiles_profileId_seq";
DROP TABLE public.profiles;
DROP SEQUENCE public."posts_postId_seq";
DROP TABLE public.posts;
DROP SEQUENCE public."accounts_accountId_seq";
DROP TABLE public.accounts;
DROP SEQUENCE public."account-profile-links_linkId_seq";
DROP TABLE public."account-profile-links";
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: account-profile-links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."account-profile-links" (
    "linkId" integer NOT NULL,
    "accountId" integer NOT NULL,
    "profileId" integer NOT NULL
);


--
-- Name: account-profile-links_linkId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."account-profile-links_linkId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account-profile-links_linkId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."account-profile-links_linkId_seq" OWNED BY public."account-profile-links"."linkId";


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    "accountId" integer NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    access character varying(255) NOT NULL,
    refresh character varying(255),
    expiration character varying(255),
    "userId" integer NOT NULL
);


--
-- Name: accounts_accountId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."accounts_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."accounts_accountId_seq" OWNED BY public.accounts."accountId";


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "imgPath" character varying(255),
    title character varying(255),
    body character varying(255),
    tags character varying(255),
    "profileId" integer NOT NULL,
    CONSTRAINT "well-formed-posts" CHECK ((("imgPath" IS NOT NULL) OR ((title IS NOT NULL) AND (body IS NOT NULL))))
);


--
-- Name: posts_postId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."posts_postId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_postId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."posts_postId_seq" OWNED BY public.posts."postId";


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    "profileId" integer NOT NULL,
    name character varying(255) NOT NULL,
    bio character varying(255),
    "imgPath" character varying(255),
    "userId" integer NOT NULL
);


--
-- Name: profiles_profileId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."profiles_profileId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_profileId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."profiles_profileId_seq" OWNED BY public.profiles."profileId";


--
-- Name: publications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publications (
    "publicationId" integer NOT NULL,
    url character varying(255) NOT NULL,
    "accountId" integer NOT NULL,
    "postId" integer NOT NULL
);


--
-- Name: publications_publicationId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."publications_publicationId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: publications_publicationId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."publications_publicationId_seq" OWNED BY public.publications."publicationId";


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    "userId" integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


--
-- Name: users_userId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."users_userId_seq" OWNED BY public.users."userId";


--
-- Name: account-profile-links linkId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links" ALTER COLUMN "linkId" SET DEFAULT nextval('public."account-profile-links_linkId_seq"'::regclass);


--
-- Name: accounts accountId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN "accountId" SET DEFAULT nextval('public."accounts_accountId_seq"'::regclass);


--
-- Name: posts postId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN "postId" SET DEFAULT nextval('public."posts_postId_seq"'::regclass);


--
-- Name: profiles profileId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles ALTER COLUMN "profileId" SET DEFAULT nextval('public."profiles_profileId_seq"'::regclass);


--
-- Name: publications publicationId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications ALTER COLUMN "publicationId" SET DEFAULT nextval('public."publications_publicationId_seq"'::regclass);


--
-- Name: users userId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN "userId" SET DEFAULT nextval('public."users_userId_seq"'::regclass);


--
-- Data for Name: account-profile-links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."account-profile-links" ("linkId", "accountId", "profileId") FROM stdin;
12	3	12
15	4	12
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts ("accountId", type, name, access, refresh, expiration, "userId") FROM stdin;
4	reddit	Art_Spread_	472782679034-Q8Kqfkiv-x6nmpHXzaVFgs-Oa2s	472782679034-RR0JSc6FAsMqK5nHVEt9VzXSf2Y	1589322144208	1
3	reddit	Art_Spread	466923361867-J6N1Ptqsj2Wg2YyfvRTJ7oK4qNA	466923361867-qCkzH0_lUWaitolSGuYPrZMLqXI	1589322144209	1
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts ("postId", "imgPath", title, body, tags, "profileId") FROM stdin;
27	/images/dW5kZWZpbmVkLTE1ODkwMDIxMjI3MjA=.png	properly working	[insert thinking emoji here]		12
33	/images/dW5kZWZpbmVkLTE1ODkzMTg4Mzk0NDQ=.png				12
34		a new test	for testing purposes		12
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles ("profileId", name, bio, "imgPath", "userId") FROM stdin;
12	test profile 1	\N	\N	1
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publications ("publicationId", url, "accountId", "postId") FROM stdin;
5	https://www.reddit.com/r/testingground4bots/comments/gg9l0v/properly_working/	4	27
6	https://www.reddit.com/r/testingground4bots/comments/gg9l0w/properly_working/	3	27
13	https://www.reddit.com/r/testingground4bots/comments/gil28g/httpsiimgurcomgd4ztv9png/	3	33
14	https://www.reddit.com/r/testingground4bots/comments/gil28h/httpsiimgurcomgd4ztv9png/	4	33
15	https://www.reddit.com/r/testingground4bots/comments/gilbgi/a_new_test/	4	34
16	https://www.reddit.com/r/testingground4bots/comments/gilbgj/a_new_test/	3	34
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users ("userId", username, password) FROM stdin;
1	user1	Password123!
2	user2	Password123!
3	user3	Password123!
\.


--
-- Name: account-profile-links_linkId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."account-profile-links_linkId_seq"', 15, true);


--
-- Name: accounts_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."accounts_accountId_seq"', 4, true);


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 35, true);


--
-- Name: profiles_profileId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."profiles_profileId_seq"', 12, true);


--
-- Name: publications_publicationId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."publications_publicationId_seq"', 18, true);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."users_userId_seq"', 3, true);


--
-- Name: account-profile-links account-profile-links_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links"
    ADD CONSTRAINT "account-profile-links_pk" PRIMARY KEY ("linkId");


--
-- Name: accounts accounts_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pk PRIMARY KEY ("accountId");


--
-- Name: posts posts_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pk PRIMARY KEY ("postId");


--
-- Name: profiles profiles_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pk PRIMARY KEY ("profileId");


--
-- Name: publications publications_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pk PRIMARY KEY ("publicationId");


--
-- Name: account-profile-links unique-account-profile-links; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links"
    ADD CONSTRAINT "unique-account-profile-links" UNIQUE ("accountId", "profileId");


--
-- Name: accounts unique-accounts; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "unique-accounts" UNIQUE (type, name);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY ("userId");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: account-profile-links account-profile-links_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links"
    ADD CONSTRAINT "account-profile-links_fk0" FOREIGN KEY ("accountId") REFERENCES public.accounts("accountId") ON DELETE CASCADE;


--
-- Name: account-profile-links account-profile-links_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links"
    ADD CONSTRAINT "account-profile-links_fk1" FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId") ON DELETE CASCADE;


--
-- Name: accounts accounts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_fk0 FOREIGN KEY ("userId") REFERENCES public.users("userId") ON DELETE CASCADE;


--
-- Name: posts posts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_fk0 FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: profiles profiles_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_fk0 FOREIGN KEY ("userId") REFERENCES public.users("userId");


--
-- Name: publications publications_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_fk0 FOREIGN KEY ("accountId") REFERENCES public.accounts("accountId") ON DELETE CASCADE;


--
-- Name: publications publications_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_fk1 FOREIGN KEY ("postId") REFERENCES public.posts("postId") ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--


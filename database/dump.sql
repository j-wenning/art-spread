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
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_fk0;
ALTER TABLE ONLY public.pools DROP CONSTRAINT pools_fk0;
ALTER TABLE ONLY public.images DROP CONSTRAINT images_fk0;
ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_fk0;
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "account-profile-links_fk1";
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "account-profile-links_fk0";
ALTER TABLE ONLY public."account-profile links" DROP CONSTRAINT "account-profile links_fk1";
ALTER TABLE ONLY public."account-profile links" DROP CONSTRAINT "account-profile links_fk0";
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pk;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_password_key;
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "unique-account-profile-links";
ALTER TABLE ONLY public.publications DROP CONSTRAINT publications_pk;
ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_pk;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pk;
ALTER TABLE ONLY public.pools DROP CONSTRAINT pools_pk;
ALTER TABLE ONLY public.images DROP CONSTRAINT images_pk;
ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_pk;
ALTER TABLE ONLY public."account-profile-links" DROP CONSTRAINT "account-profile-links_pk";
ALTER TABLE ONLY public."account-profile links" DROP CONSTRAINT "account-profile links_pk";
ALTER TABLE public.users ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE public.publications ALTER COLUMN "publicationId" DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN "profileId" DROP DEFAULT;
ALTER TABLE public.posts ALTER COLUMN "postId" DROP DEFAULT;
ALTER TABLE public.pools ALTER COLUMN "poolId" DROP DEFAULT;
ALTER TABLE public.images ALTER COLUMN "imageId" DROP DEFAULT;
ALTER TABLE public.accounts ALTER COLUMN "accountId" DROP DEFAULT;
ALTER TABLE public."account-profile-links" ALTER COLUMN "linkId" DROP DEFAULT;
ALTER TABLE public."account-profile links" ALTER COLUMN "linkId" DROP DEFAULT;
DROP SEQUENCE public."users_userId_seq";
DROP TABLE public.users;
DROP SEQUENCE public."publications_publicationId_seq";
DROP TABLE public.publications;
DROP SEQUENCE public."profiles_profileId_seq";
DROP TABLE public.profiles;
DROP SEQUENCE public."posts_postId_seq";
DROP TABLE public.posts;
DROP SEQUENCE public."pools_poolId_seq";
DROP TABLE public.pools;
DROP SEQUENCE public."images_imageId_seq";
DROP TABLE public.images;
DROP SEQUENCE public."accounts_accountId_seq";
DROP TABLE public.accounts;
DROP SEQUENCE public."account-profile-links_linkId_seq";
DROP TABLE public."account-profile-links";
DROP SEQUENCE public."account-profile links_linkId_seq";
DROP TABLE public."account-profile links";
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
-- Name: account-profile links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."account-profile links" (
    "linkId" integer NOT NULL,
    "accountId" integer NOT NULL,
    "profileId" integer NOT NULL
);


--
-- Name: account-profile links_linkId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."account-profile links_linkId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account-profile links_linkId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."account-profile links_linkId_seq" OWNED BY public."account-profile links"."linkId";


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
    name character varying(255) NOT NULL,
    "acountToken" character varying(255) NOT NULL,
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
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    "imageId" integer NOT NULL,
    "imagePath" character varying(255) NOT NULL,
    "postId" integer NOT NULL
);


--
-- Name: images_imageId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."images_imageId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_imageId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."images_imageId_seq" OWNED BY public.images."imageId";


--
-- Name: pools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pools (
    "poolId" integer NOT NULL,
    "postBody" character varying(255),
    "postTags" character varying(255),
    "profileId" integer NOT NULL
);


--
-- Name: pools_poolId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."pools_poolId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pools_poolId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."pools_poolId_seq" OWNED BY public.pools."poolId";


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "postBody" character varying(255),
    "postTags" character varying(255),
    "profileId" integer NOT NULL
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
    "profileName" character varying(255) NOT NULL,
    "avatarPath" character varying(255) NOT NULL,
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
-- Name: account-profile links linkId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile links" ALTER COLUMN "linkId" SET DEFAULT nextval('public."account-profile links_linkId_seq"'::regclass);


--
-- Name: account-profile-links linkId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links" ALTER COLUMN "linkId" SET DEFAULT nextval('public."account-profile-links_linkId_seq"'::regclass);


--
-- Name: accounts accountId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN "accountId" SET DEFAULT nextval('public."accounts_accountId_seq"'::regclass);


--
-- Name: images imageId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN "imageId" SET DEFAULT nextval('public."images_imageId_seq"'::regclass);


--
-- Name: pools poolId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools ALTER COLUMN "poolId" SET DEFAULT nextval('public."pools_poolId_seq"'::regclass);


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
-- Data for Name: account-profile links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."account-profile links" ("linkId", "accountId", "profileId") FROM stdin;
\.


--
-- Data for Name: account-profile-links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."account-profile-links" ("linkId", "accountId", "profileId") FROM stdin;
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts ("accountId", name, "acountToken", "userId") FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.images ("imageId", "imagePath", "postId") FROM stdin;
\.


--
-- Data for Name: pools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pools ("poolId", "postBody", "postTags", "profileId") FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts ("postId", "postBody", "postTags", "profileId") FROM stdin;
1	time to party	#itslit	1
4	its all about that boba	#boba	4
5	His palms are sweaty knees weak arms are heavy	#nervous	5
12	my horn can pierce the sky - the officIe	#theoffice	4
13	you get toilet paper, EVERYONE GETS TOILET PAPER!	#toiletpaper	1
14	dont drop that dun dun dun	#dropit	5
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles ("profileId", "profileName", "avatarPath", "userId") FROM stdin;
1	JoliDali	./public/images/sali	1
4	bobaBae	./public/images/BOBABAE	1
5	DOYOUTHINK	./public/images/DOYOUTHINK	1
\.


--
-- Data for Name: publications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publications ("publicationId", url, "accountId", "postId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users ("userId", username, password) FROM stdin;
\.


--
-- Name: account-profile links_linkId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."account-profile links_linkId_seq"', 1, false);


--
-- Name: account-profile-links_linkId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."account-profile-links_linkId_seq"', 1, false);


--
-- Name: accounts_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."accounts_accountId_seq"', 1, false);


--
-- Name: images_imageId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."images_imageId_seq"', 1, false);


--
-- Name: pools_poolId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."pools_poolId_seq"', 1, false);


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 14, true);


--
-- Name: profiles_profileId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."profiles_profileId_seq"', 11, true);


--
-- Name: publications_publicationId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."publications_publicationId_seq"', 1, false);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."users_userId_seq"', 1, false);


--
-- Name: account-profile links account-profile links_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile links"
    ADD CONSTRAINT "account-profile links_pk" PRIMARY KEY ("linkId");


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
-- Name: images images_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pk PRIMARY KEY ("imageId");


--
-- Name: pools pools_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_pk PRIMARY KEY ("poolId");


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
-- Name: users users_password_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_password_key UNIQUE (password);


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
-- Name: account-profile links account-profile links_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile links"
    ADD CONSTRAINT "account-profile links_fk0" FOREIGN KEY ("accountId") REFERENCES public.accounts("accountId");


--
-- Name: account-profile links account-profile links_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile links"
    ADD CONSTRAINT "account-profile links_fk1" FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: account-profile-links account-profile-links_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links"
    ADD CONSTRAINT "account-profile-links_fk0" FOREIGN KEY ("accountId") REFERENCES public.accounts("accountId");


--
-- Name: account-profile-links account-profile-links_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."account-profile-links"
    ADD CONSTRAINT "account-profile-links_fk1" FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: accounts accounts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_fk0 FOREIGN KEY ("userId") REFERENCES public.users("userId");


--
-- Name: images images_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_fk0 FOREIGN KEY ("postId") REFERENCES public.posts("postId");


--
-- Name: pools pools_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_fk0 FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: posts posts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_fk0 FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: publications publications_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_fk0 FOREIGN KEY ("accountId") REFERENCES public.accounts("accountId");


--
-- Name: publications publications_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_fk1 FOREIGN KEY ("postId") REFERENCES public.posts("postId");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--


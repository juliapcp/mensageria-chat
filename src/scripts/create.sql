

CREATE TABLE public.usuario (
	email varchar NOT NULL,
	nome varchar NULL,
	senha varchar NULL,
	CONSTRAINT usuario_pk PRIMARY KEY (email)
);


CREATE SEQUENCE grupo_id_seq;
CREATE TABLE public.grupo (
	id integer NOT NULL DEFAULT nextval('grupo_id_seq'),
	nome varchar NULL,
	emailcriador varchar NULL,
	datacriacao date NULL,
	CONSTRAINT grupo_pk PRIMARY KEY (id)
);


CREATE SEQUENCE usuariogrupo_id_seq;

CREATE TABLE public.usuariogrupo (
	id integer NOT NULL DEFAULT nextval('usuariogrupo_id_seq'),
	emailusuario varchar NOT NULL,
	idgrupo int4 NOT NULL,
	permissao varchar NOT NULL,
	CONSTRAINT usuariogrupo_check CHECK ((((permissao)::text = ANY ((ARRAY['admin'::character varying, 'leitor'::character varying, 'escritor'::character varying])::text[])))),
	CONSTRAINT usuariogrupo_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX usuariogrupo_emailusuario_idx ON public.usuariogrupo (emailusuario,idgrupo);


CREATE sequence mensagem_id_seq;
CREATE TABLE public.mensagem (
	id integer NOT NULL DEFAULT nextval('mensagem_id_seq'),
	emailusuario varchar NOT NULL,
	dataenvio timestamp NULL,
	texto varchar NULL,
	idgrupo int4 NOT NULL,
	CONSTRAINT mensagem_pk PRIMARY KEY (id),
	CONSTRAINT mensagem_fk_1 FOREIGN KEY (idgrupo) REFERENCES public.grupo(id)
);
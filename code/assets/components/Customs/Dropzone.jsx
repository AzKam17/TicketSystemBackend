import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import cx from 'classnames';

const file_img = require('../../misc/file_img.svg');
const file_pdf = require('../../misc/file_pdf.svg');
const file_word = require('../../misc/file_word.svg');
const file_audio = require('../../misc/file_audio.svg');
const file_video = require('../../misc/file_video.svg');
const file_default = require('../../misc/file_default.svg');
const file_powerpoint = require('../../misc/file_powerpoint.svg');

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out'
};

const focusedStyle = {
	borderColor: '#2196f3'
};

export default function Dropzone({ onChange, ...props }) {
	useDropzone();
	const files_icons_url = '/images/icons/';
	const [files, setFiles] = useState([]);
	const { getRootProps, getInputProps, isFocused } = useDropzone({
		maxFiles: 70,
		// Use file icon
		onDrop: (acceptedFiles) => {
			setFiles(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: file.name.split('.').pop()
					})
				)
			);
		}
	});

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {})
		}),
		[isFocused]
	);

	const imgFromFileType = (fileType) => {
		switch (fileType) {
			case 'pdf':
				return file_pdf;
			case 'doc':
			case 'docx':
				return file_word;
			case 'ppt':
			case 'pptx':
				return file_powerpoint;
			case 'jpg':
			case 'jpeg':
			case 'png':
			case 'gif':
				return file_img;
			case 'mp3':
			case 'wav':
			case 'ogg':
				return file_audio;
			case 'mp4':
			case 'avi':
			case 'mov':
				return file_video;
			default:
				return file_default;
		}
	};

	const thumbs = files.map((file, index) => (
		/*
    preview
    file icon on top of the file name
    cross to delete file
     */
		<tr key={index}>
			<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
				<img
					className="h-8 w-8"
					src={imgFromFileType(file.preview)}
					alt=""
				/>
			</td>
			<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap justify-items-center">
				<div className="text-sm text-gray-900">
					{
						// Only print the first 20 characters of the file name
						file.name.length > 25
							? file.name.substring(0, 25) + '...'
							: file.name
					}
				</div>
				<div className="text-sm text-gray-500">{file.size} bytes</div>
			</td>
			<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
				<button
					className={cx('text-red-600 hover:text-red-900')}
					onClick={() => {
						setFiles(files.filter((f) => f !== file));
					}}
				>
					Retirer
				</button>
			</td>
		</tr>
	));

	useEffect(() => {
		return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
	}, []);

	useEffect(() => {
		if (files.length >= 0) {
			onChange(files);
		}
	}, [files]);

	return (
		<div className="container">
			<div {...getRootProps({ style })}>
				<input multiple {...getInputProps()} />
				<p>
					Glisser et déposer des fichiers ici, ou cliquer pour
					sélectionner les ajouter
				</p>
			</div>
			{thumbs.length > 0 && (
				<table className="table-auto w-full bg-slate-50">
					<thead className="text-xs font-semibold uppercase text-slate-500 border-t border-b border-slate-200">
						<tr>
							<th className="px-4 py-3">Fichier</th>
							<th className="px-4 py-3">Tailles</th>
							<th className="px-4 py-3">Actions</th>
						</tr>
					</thead>
					<tbody className="text-sm divide-y divide-slate-200">
						{thumbs}
						<tr>
							{/* Button to delete all files */}
							<td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
								<button
									className={cx(
										'text-red-600 hover:text-red-900'
									)}
									onClick={() => {
										setFiles([]);
									}}
								>
									Tout retirer
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			)}
		</div>
	);
}
